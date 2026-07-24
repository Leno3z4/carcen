type WalletStatus =
  | "disconnected"
  | "connecting"
  | "connected"
  | "wrong-network"
  | "pending"
  | "confirmed"
  | "failed";

type WalletStatusProps = {
  status: WalletStatus;
};

export default function WalletStatus({
  status,
}: WalletStatusProps) {
  const labels: Record<WalletStatus, string> = {
    disconnected: "Disconnected",
    connecting: "Connecting...",
    connected: "Connected",
    "wrong-network": "Wrong Network",
    pending: "Transaction Pending",
    confirmed: "Transaction Confirmed",
    failed: "Transaction Failed",
  };

  return (
    <span className="text-sm font-medium text-neutral-600">
      {labels[status]}
    </span>
  );
}
