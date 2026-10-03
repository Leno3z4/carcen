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
  WQMS_USDC_PAIR: Address;
  LIQUIDITY_QMS: string;
  LIQUIDITY_FUND_QMS: string;
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


const liquidityRouterAbi = [
  {
    type: "function",
    name: "addLiquidity",
    stateMutability: "nonpayable",
    inputs: [
      { name: "tokenA", type: "address" },
      { name: "tokenB", type: "address" },
      { name: "amountADesired", type: "uint256" },
      { name: "amountBDesired", type: "uint256" },
      { name: "amountAMin", type: "uint256" },
      { name: "amountBMin", type: "uint256" },
      { name: "to", type: "address" },
      { name: "deadline", type: "uint256" },
    ],
    outputs: [
      { name: "amountA", type: "uint256" },
      { name: "amountB", type: "uint256" },
      { name: "liquidity", type: "uint256" },
    ],
  },
] as const;

const pairAbi = [
  {
    type: "function",
    name: "token0",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
  },
  {
    type: "function",
    name: "token1",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
  },
  {
    type: "function",
    name: "getReserves",
    stateMutability: "view",
    inputs: [],
    outputs: [
      { name: "reserve0", type: "uint112" },
      { name: "reserve1", type: "uint112" },
      { name: "blockTimestampLast", type: "uint32" },
    ],
  },
] as const;

const wqmsWrapAbi = [
  {
    type: "function",
    name: "deposit",
    stateMutability: "payable",
    inputs: [],
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


async function ensureTokenApproval(
  publicClient: ReturnType<typeof createPublicClient>,
  walletClient: ReturnType<typeof createWalletClient>,
  token: Address,
  spender: Address,
  account: ReturnType<typeof privateKeyToAccount>,
  amount: bigint,
): Promise<void> {
  const allowance = await publicClient.readContract({
    address: token,
    abi: erc20Abi,
    functionName: "allowance",
    args: [account.address, spender],
  });

  if (allowance >= amount) return;

  const approvalHash = await walletClient.writeContract({
    address: token,
    abi: erc20Abi,
    functionName: "approve",
    args: [spender, amount],
    account,
  });

  await publicClient.waitForTransactionReceipt({ hash: approvalHash });
  console.log(
    JSON.stringify({
      event: "approval_confirmed",
      token,
      spender,
      amount: amount.toString(),
      tx: approvalHash,
    }),
  );
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


async function addWqmsUsdcLiquidity(
  publicClient: ReturnType<typeof createPublicClient>,
  walletClient: ReturnType<typeof createWalletClient>,
  env: Env,
  account: ReturnType<typeof privateKeyToAccount>,
): Promise<void> {
  const liquidityQms = parseEther(env.LIQUIDITY_QMS || "0.1");
  const fundingQms = parseEther(env.LIQUIDITY_FUND_QMS || "0.1");
  const reserveQms = parseEther(env.QMS_RESERVE || "0.5");

  const pairToken0 = await publicClient.readContract({
    address: env.WQMS_USDC_PAIR,
    abi: pairAbi,
    functionName: "token0",
  });
  const pairToken1 = await publicClient.readContract({
    address: env.WQMS_USDC_PAIR,
    abi: pairAbi,
    functionName: "token1",
  });
  const [reserve0, reserve1] = await publicClient.readContract({
    address: env.WQMS_USDC_PAIR,
    abi: pairAbi,
    functionName: "getReserves",
  });

  const wqms = env.WQMS.toLowerCase();
  const usdc = env.USDC.toLowerCase();
  let usdcDesired: bigint;

  if (pairToken0.toLowerCase() === wqms && pairToken1.toLowerCase() === usdc) {
    usdcDesired = (reserve1 * liquidityQms) / reserve0;
  } else if (
    pairToken0.toLowerCase() === usdc &&
    pairToken1.toLowerCase() === wqms
  ) {
    usdcDesired = (reserve0 * liquidityQms) / reserve1;
  } else {
    throw new Error(
      "Configured WQMS/USDC pair has unexpected tokens: " +
        pairToken0 +
        "/" +
        pairToken1,
    );
  }

  if (usdcDesired <= 0n) {
    throw new Error("WQMS/USDC pool returned no usable USDC liquidity quote");
  }

  let nativeBalance = await publicClient.getBalance({ address: account.address });
  let usdcBalance = await publicClient.readContract({
    address: env.USDC,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [account.address],
  });

  console.log(
    JSON.stringify({
      event: "liquidity_plan",
      pool: env.WQMS_USDC_PAIR,
      qmsToDeposit: liquidityQms.toString(),
      usdcDesired: usdcDesired.toString(),
      usdcBalance: usdcBalance.toString(),
    }),
  );

  if (usdcBalance < usdcDesired) {
    const requiredNative = liquidityQms + fundingQms + reserveQms;
    if (nativeBalance < requiredNative) {
      console.log(
        JSON.stringify({
          event: "skip",
          reason: "insufficient_qms_for_liquidity_and_usdc_funding",
          balance: nativeBalance.toString(),
          required: requiredNative.toString(),
        }),
      );
      return;
    }

    const fundingQuote = await quote(
      publicClient,
      env,
      fundingQms,
      [env.WQMS, env.USDC],
    );
    const deficit = usdcDesired - usdcBalance;
    if (fundingQuote < deficit) {
      console.log(
        JSON.stringify({
          event: "skip",
          reason: "configured_qms_funding_would_not_cover_usdc_requirement",
          fundingQms: fundingQms.toString(),
          quotedUsdc: fundingQuote.toString(),
          deficitUsdc: deficit.toString(),
        }),
      );
      return;
    }

    const fundingMinOut = minOut(fundingQuote, env);
    const fundingHash = await walletClient.writeContract({
      address: env.QWAP_ROUTER,
      abi: qwapRouterAbi,
      functionName: "swapExactETHForTokens",
      args: [
        fundingMinOut,
        [env.WQMS, env.USDC],
        account.address,
        deadline(env),
      ],
      account,
      value: fundingQms,
    });
    const fundingReceipt = await publicClient.waitForTransactionReceipt({
      hash: fundingHash,
    });
    if (fundingReceipt.status !== "success") {
      throw new Error("QMS -> USDC funding swap reverted: " + fundingHash);
    }

    usdcBalance = await publicClient.readContract({
      address: env.USDC,
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [account.address],
    });
    nativeBalance = await publicClient.getBalance({ address: account.address });

    if (usdcBalance < usdcDesired) {
      console.log(
        JSON.stringify({
          event: "skip",
          reason: "usdc_requirement_still_not_met_after_funding_swap",
          usdcBalance: usdcBalance.toString(),
          required: usdcDesired.toString(),
        }),
      );
      return;
    }

    console.log(
      JSON.stringify({
        event: "liquidity_funding_swap_confirmed",
        qmsIn: fundingQms.toString(),
        quotedUsdc: fundingQuote.toString(),
        tx: fundingHash,
      }),
    );
  } else if (nativeBalance < liquidityQms + reserveQms) {
    console.log(
      JSON.stringify({
        event: "skip",
        reason: "insufficient_qms_for_liquidity_plus_reserve",
        balance: nativeBalance.toString(),
        required: (liquidityQms + reserveQms).toString(),
      }),
    );
    return;
  }

  const wrapHash = await walletClient.writeContract({
    address: env.WQMS,
    abi: wqmsWrapAbi,
    functionName: "deposit",
    account,
    value: liquidityQms,
  });
  const wrapReceipt = await publicClient.waitForTransactionReceipt({
    hash: wrapHash,
  });
  if (wrapReceipt.status !== "success") {
    throw new Error("QMS -> WQMS wrap reverted: " + wrapHash);
  }

  await ensureTokenApproval(
    publicClient,
    walletClient,
    env.WQMS,
    env.QWAP_ROUTER,
    account,
    liquidityQms,
  );
  await ensureTokenApproval(
    publicClient,
    walletClient,
    env.USDC,
    env.QWAP_ROUTER,
    account,
    usdcDesired,
  );

  const hash = await walletClient.writeContract({
    address: env.QWAP_ROUTER,
    abi: liquidityRouterAbi,
    functionName: "addLiquidity",
    args: [
      env.WQMS,
      env.USDC,
      liquidityQms,
      usdcDesired,
      minOut(liquidityQms, env),
      minOut(usdcDesired, env),
      account.address,
      deadline(env),
    ],
    account,
  });

  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  if (receipt.status !== "success") {
    throw new Error("WQMS/USDC addLiquidity reverted: " + hash);
  }

  console.log(
    JSON.stringify({
      event: "liquidity_confirmed",
      pair: env.WQMS_USDC_PAIR,
      qmsDeposited: liquidityQms.toString(),
      usdcDeposited: usdcDesired.toString(),
      tx: hash,
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
      "QMS/QWAP testnet worker is running. Swaps run every 30 minutes and WQMS/USDC liquidity runs on the 32-minute Cron trigger.",
    );
  },

  async scheduled(
    _event: ScheduledController,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<void> {
    const job =
      _event.cron === "*/32 * * * *"
        ? addWqmsUsdcLiquidity
        : _event.cron === "*/30 * * * *"
          ? runOnce
          : null;

    if (!job) {
      throw new Error("Unknown cron trigger: " + _event.cron);
    }

    ctx.waitUntil(
      job(env).catch((error) => {
        console.error(
          JSON.stringify({
            event:
              _event.cron === "*/32 * * * *"
                ? "liquidity_error"
                : "swap_error",
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
          }),
        );
        throw error;
      }),
    );
  },
};
