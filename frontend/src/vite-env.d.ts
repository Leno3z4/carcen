/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MARKET_ADDRESS: string;
  readonly VITE_ARC_RPC_URL: string;
  readonly VITE_ARC_CHAIN_ID: string;
  readonly VITE_SNAPSHOT_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
