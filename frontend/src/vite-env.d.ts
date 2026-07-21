/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MARKET_ADDRESS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
