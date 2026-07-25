import { useAccount } from "wagmi";
import { ARC_CHAIN_ID } from "@/lib/contract";

export type TxState = "idle" | "pending" | "confirmed" | "failed";

interface WalletStateBannerProps {
  txState?: TxState;
  txError?: string;
}

/** Central place for the 7 wallet/tx states from the brief: disconnected,
 * connecting, connected, wrong network, tx pending, tx confirmed, tx failed.
 * Other components import this rather than each rolling their own banner. */
export function WalletStateBanner({ txState = "idle", txError }: WalletStateBannerProps) {
  const { isConnected, chain } = useAccount();

  if (!isConnected) {
    return (
      <div className="rounded-control bg-black/5 px-3 py-2 text-sm text-text-secondary">
        Connect your wallet to trade.
      </div>
    );
  }

  if (chain && chain.id !== ARC_CHAIN_ID) {
    return (
      <div className="rounded-control bg-amber-50 px-3 py-2 text-sm text-amber-700">
        Wrong network — switch to Arc Testnet in your wallet.
      </div>
    );
  }

  if (txState === "pending") {
    return (
      <div className="rounded-control bg-blue-50 px-3 py-2 text-sm text-blue-700">
        Transaction pending — confirm in your wallet and wait for the block.
      </div>
    );
  }

  if (txState === "confirmed") {
    return (
      <div className="rounded-control bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
        Transaction confirmed.
      </div>
    );
  }

  if (txState === "failed") {
    return (
      <div className="rounded-control bg-red-50 px-3 py-2 text-sm text-red-700">
        Transaction failed{txError ? `: ${txError}` : "."}
      </div>
    );
  }

  return null;
}
