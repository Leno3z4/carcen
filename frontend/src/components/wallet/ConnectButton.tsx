import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Button } from "@/components/ui/Button";
import { truncateAddress } from "@/lib/utils";

export default function ConnectButton() {
  const { address, isConnected } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected && address) {
    return (
      <button
        onClick={() => disconnect()}
        className="flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors px-3 py-1.5 text-sm text-white"
        title="Click to disconnect"
      >
        <span className="h-2 w-2 rounded-full bg-emerald-400" />
        {truncateAddress(address)}
      </button>
    );
  }

  const connector = connectors[0];

  return (
    <Button
      size="sm"
      onClick={() => connector && connect({ connector })}
      disabled={isPending || !connector}
      className="!bg-white !text-black hover:!bg-white/90"
    >
      {isPending ? "Connecting..." : "Connect Wallet"}
    </Button>
  );
}
