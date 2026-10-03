import {
  createPublicClient,
  createWalletClient,
  http,
  parseEther,
  type Address,
  type Hex,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";

interface Env {
  QMS_RPC_URL: string;
  QMS_CHAIN_ID: number;
  QWAP_ROUTER: Address;
  WQMS: Address;
  USDC: Address;
  SWAP_QMS: string;
  QMS_RESERVE: string;
  SLIPPAGE_BPS: string;
  TX_DEADLINE_SECONDS: string;
  USDC_DUST: string;
  WALLET_PRIVATE_KEY?: string;
}

const erc20Abi = [
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "allowance",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "approve",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
] as const;

const qwapRouterAbi = [
  {
    type: "function",
    name: "getAmountsOut",
    stateMutability: "view",
    inputs: [
      { name: "amountIn", type: "uint256" },
      { name: "path", type: "address[]" },
    ],
    outputs: [{ name: "amounts", type: "uint256[]" }],
  },
  {
    type: "function",
    name: "swapExactETHForTokens",
    stateMutability: "payable",
    inputs: [
      { name: "amountOutMin", type: "uint256" },
      { name: "path", type: "address[]" },
      { name: "to", type: "address" },
      { name: "deadline", type: "uint256" },
    ],
    outputs: [{ name: "amounts", type: "uint256[]" }],
  },
  {
    type: "function",
    name: "swapExactTokensForTokens",
    stateMutability: "nonpayable",
    inputs: [
      { name: "amountIn", type: "uint256" },
      { name: "amountOutMin", type: "uint256" },
      { name: "path", type: "address[]" },
      { name: "to", type: "address" },
      { name: "deadline", type: "uint256" },
    ],
    outputs: [{ name: "amounts", type: "uint256[]" }],
  },
] as const;

const wqmsAbi = [
  {
    type: "function",
    name: "withdraw",
    stateMutability: "nonpayable",
    inputs: [{ name: "wad", type: "uint256" }],
    outputs: [],
  },
] as const;

const DEFAULT_SLIPPAGE_BPS = 500n;

function privateKey(value: string): Hex {
  const key = value.trim();
  return (key.startsWith("0x") ? key : `0x${key}`) as Hex;
}

function deadline(env: Env): bigint {
  return BigInt(
    Math.floor(Date.now() / 1000) +
      Number(env.TX_DEADLINE_SECONDS || "180"),
  );
}

function minOut(quoted: bigint, env: Env): bigint {
  const slippage = BigInt(
    Math.max(0, Math.min(9_999, Number(env.SLIPPAGE_BPS || DEFAULT_SLIPPAGE_BPS))),
  );
  return (quoted * (10_000n - slippage)) / 10_000n;
}

async function quote(
  publicClient: ReturnType<typeof createPublicClient>,
  env: Env,
  amountIn: bigint,
  path: Address[],
): Promise<bigint> {
  const amounts = await publicClient.readContract({
    address: env.QWAP_ROUTER,
    abi: qwapRouterAbi,
    functionName: "getAmountsOut",
    args: [amountIn, path],
  });
  const last = amounts[amounts.length - 1];
  if (!last || last <= 0n) {
    throw new Error(`No usable QWAP quote for path ${path.join(" -> ")}`);
  }
  return last;
}

async function ensureApproval(
  publicClient: ReturnType<typeof createPublicClient>,
  walletClient: ReturnType<typeof createWalletClient>,
  env: Env,
  account: ReturnType<typeof privateKeyToAccount>,
  amount: bigint,
): Promise<void> {
  const allowance = await publicClient.readContract({
    address: env.USDC,
    abi: erc20Abi,
    functionName: "allowance",
    args: [account.address, env.QWAP_ROUTER],
  });

  if (allowance >= amount) return;

  const approvalHash = await walletClient.writeContract({
    address: env.USDC,
    abi: erc20Abi,
    functionName: "approve",
    args: [env.QWAP_ROUTER, amount],
    account,
  });

  await publicClient.waitForTransactionReceipt({ hash: approvalHash });
  console.log(JSON.stringify({ event: "approval_confirmed", tx: approvalHash }));
}

async function swapQmsToUsdc(
  publicClient: ReturnType<typeof createPublicClient>,
  walletClient: ReturnType<typeof createWalletClient>,
  env: Env,
  account: ReturnType<typeof privateKeyToAccount>,
): Promise<void> {
  const amountIn = parseEther(env.SWAP_QMS || "0.5");
  const reserve = parseEther(env.QMS_RESERVE || "0.5");
  const nativeBalance = await publicClient.getBalance({ address: account.address });

  if (nativeBalance < amountIn + reserve) {
    console.log(
      JSON.stringify({
        event: "skip",
        reason: "insufficient_qms_for_swap_plus_reserve",
        balance: nativeBalance.toString(),
        required: (amountIn + reserve).toString(),
      }),
    );
    return;
  }

  const path: Address[] = [env.WQMS, env.USDC];
  const quoted = await quote(publicClient, env, amountIn, path);
  const amountOutMin = minOut(quoted, env);

  const hash = await walletClient.writeContract({
    address: env.QWAP_ROUTER,
    abi: qwapRouterAbi,
    functionName: "swapExactETHForTokens",
    args: [amountOutMin, path, account.address, deadline(env)],
    account,
    value: amountIn,
  });

  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  if (receipt.status !== "success") {
    throw new Error(`QMS -> USDC reverted: ${hash}`);
  }

  console.log(
    JSON.stringify({
      event: "swap_confirmed",
      direction: "QMS->USDC",
      amountIn: amountIn.toString(),
      quotedOut: quoted.toString(),
      amountOutMin: amountOutMin.toString(),
      tx: hash,
    }),
  );
}

async function swapUsdcToQms(
  publicClient: ReturnType<typeof createPublicClient>,
  walletClient: ReturnType<typeof createWalletClient>,
  env: Env,
  account: ReturnType<typeof privateKeyToAccount>,
): Promise<void> {
  const usdcBalance = await publicClient.readContract({
    address: env.USDC,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [account.address],
  });

  const dust = BigInt(env.USDC_DUST || "1");
  if (usdcBalance <= dust) {
    console.log(
      JSON.stringify({
        event: "skip",
        reason: "no_usdc_to_sell",
        usdcBalance: usdcBalance.toString(),
      }),
    );
    return;
  }

  await ensureApproval(
    publicClient,
    walletClient,
    env,
    account,
    usdcBalance,
  );

  const path: Address[] = [env.USDC, env.WQMS];
  const quoted = await quote(publicClient, env, usdcBalance, path);
  const amountOutMin = minOut(quoted, env);

  const swapHash = await walletClient.writeContract({
    address: env.QWAP_ROUTER,
    abi: qwapRouterAbi,
    functionName: "swapExactTokensForTokens",
    args: [
      usdcBalance,
      amountOutMin,
      path,
      account.address,
      deadline(env),
    ],
    account,
  });

  const receipt = await publicClient.waitForTransactionReceipt({
    hash: swapHash,
  });
  if (receipt.status !== "success") {
    throw new Error(`USDC -> WQMS reverted: ${swapHash}`);
  }

  console.log(
    JSON.stringify({
      event: "swap_confirmed",
      direction: "USDC->WQMS",
      amountIn: usdcBalance.toString(),
      quotedOut: quoted.toString(),
      amountOutMin: amountOutMin.toString(),
      tx: swapHash,
    }),
  );

  const wqmsBalance = await publicClient.readContract({
    address: env.WQMS,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [account.address],
  });

  if (wqmsBalance <= 0n) {
    throw new Error("USDC swap succeeded but wallet has no WQMS to unwrap");
  }

  const unwrapHash = await walletClient.writeContract({
    address: env.WQMS,
    abi: wqmsAbi,
    functionName: "withdraw",
    args: [wqmsBalance],
    account,
  });

  const unwrapReceipt = await publicClient.waitForTransactionReceipt({
    hash: unwrapHash,
  });
  if (unwrapReceipt.status !== "success") {
    throw new Error(`WQMS -> QMS unwrap reverted: ${unwrapHash}`);
  }

  console.log(
    JSON.stringify({
      event: "unwrap_confirmed",
      direction: "WQMS->QMS",
      amount: wqmsBalance.toString(),
      tx: unwrapHash,
    }),
  );
}

async function runOnce(env: Env): Promise<void> {
  if (!env.WALLET_PRIVATE_KEY) {
    throw new Error(
      "WALLET_PRIVATE_KEY is missing. Set it with: wrangler secret put WALLET_PRIVATE_KEY",
    );
  }

  if (Number(env.QMS_CHAIN_ID) !== 19480) {
    throw new Error(`Refusing to run on unexpected chain id ${env.QMS_CHAIN_ID}`);
  }

  const account = privateKeyToAccount(privateKey(env.WALLET_PRIVATE_KEY));

  const transport = http(env.QMS_RPC_URL);
  const publicClient = createPublicClient({
    chain: {
      id: Number(env.QMS_CHAIN_ID),
      name: "QMS Testnet",
      nativeCurrency: { name: "QMS", symbol: "QMS", decimals: 18 },
      rpcUrls: { default: { http: [env.QMS_RPC_URL] } },
    },
    transport,
  });

  const walletClient = createWalletClient({
    account,
    chain: {
      id: Number(env.QMS_CHAIN_ID),
      name: "QMS Testnet",
      nativeCurrency: { name: "QMS", symbol: "QMS", decimals: 18 },
      rpcUrls: { default: { http: [env.QMS_RPC_URL] } },
    },
    transport,
  });

  const chainId = await publicClient.getChainId();
  if (chainId !== Number(env.QMS_CHAIN_ID)) {
    throw new Error(`RPC reported chain ${chainId}, expected ${env.QMS_CHAIN_ID}`);
  }

  const usdcBalance = await publicClient.readContract({
    address: env.USDC,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [account.address],
  });

  console.log(
    JSON.stringify({
      event: "tick",
      wallet: account.address,
      chainId,
      qmsSwapAmount: env.SWAP_QMS,
      usdcBalance: usdcBalance.toString(),
    }),
  );

  if (usdcBalance > BigInt(env.USDC_DUST || "1")) {
    await swapUsdcToQms(publicClient, walletClient, env, account);
  } else {
    await swapQmsToUsdc(publicClient, walletClient, env, account);
  }
}

export default {
  async fetch(): Promise<Response> {
    return new Response(
      "QMS/QWAP testnet swapper is running. Swaps execute on the 10-minute Cron trigger.",
    );
  },

  async scheduled(
    _event: ScheduledController,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<void> {
    ctx.waitUntil(
      runOnce(env).catch((error) => {
        console.error(
          JSON.stringify({
            event: "swap_error",
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
          }),
        );
        throw error;
      }),
    );
  },
};
