import { defineChain } from "viem";

// Arc  Testnet — EVM-compatible L1, USDC as native gas (6 decimals).
// Verify against https://docs.arc.io/arc/references/connect-to-arc if anything changes.
export const arcTestnet = defineChain({
  id: 5042002,
  name: "Arc Testnet",
  nativeCurrency: {
    name: "USD Coin",
    symbol: "USDC",
    decimals: 18, // native accounting uses 18 decimals; the ERC-20 interface (USDC_ADDRESS below) uses 6
  },
  rpcUrls: {
    default: { http: ["https://rpc.testnet.arc.network"] },
  },
  blockExplorers: {
    default: { name: "Arcscan", url: "https://testnet.arcscan.app" },
  },
  testnet: true,
});

// Predeployed on Arc Testnet — see https://docs.arc.io/arc/references/contract-addresses
export const USDC_ADDRESS = "0x3600000000000000000000000000000000000000" as const;
export const MEMO_ADDRESS = "0x5294E9927c3306DcBaDb03fe70b92e01cCede505" as const;
