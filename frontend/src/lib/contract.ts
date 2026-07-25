export const MARKET_ADDRESS = import.meta.env.VITE_MARKET_ADDRESS as `0x${string}`;
export const ARC_RPC_URL = import.meta.env.VITE_ARC_RPC_URL as string;
export const ARC_CHAIN_ID = Number(import.meta.env.VITE_ARC_CHAIN_ID ?? 1);
export const SNAPSHOT_BASE_URL = import.meta.env.VITE_SNAPSHOT_BASE_URL as string;

if (!MARKET_ADDRESS) {
  console.warn(
    "VITE_MARKET_ADDRESS is not set — contract reads/writes will fail. Check your .env file."
  );
}
