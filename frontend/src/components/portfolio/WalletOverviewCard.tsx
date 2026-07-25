import { useAccount, useBalance } from "wagmi";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { truncateAddress } from "@/lib/utils";
import { Copy, Gift } from "lucide-react";

export default function WalletOverviewCard({
  portfolioValue,
  todayPnl,
  totalPnl,
}: {
  portfolioValue: number;
  todayPnl: number;
  totalPnl: number;
}) {
  const { address } = useAccount();
  const { data: balance } = useBalance({ address });

  if (!address) {
    return (
      <Card>
        <p className="text-sm text-text-secondary">Connect your wallet to view your portfolio.</p>
      </Card>
    );
  }

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-text-secondary">Wallet</div>
          <div className="font-medium">{truncateAddress(address)}</div>
        </div>
        <button
          onClick={() => navigator.clipboard.writeText(address)}
          className="text-text-secondary hover:text-text-primary"
          title="Copy address"
        >
          <Copy className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-xs text-text-secondary">ARC Balance</div>
          <div className="text-lg font-semibold">
            {balance ? Number(balance.formatted).toFixed(2) : "0.00"} {balance?.symbol ?? "USDC"}
          </div>
        </div>
        <div>
          <div className="text-xs text-text-secondary">Portfolio Value</div>
          <div className="text-lg font-semibold">{portfolioValue.toFixed(2)} USDC</div>
        </div>
        <div>
          <div className="text-xs text-text-secondary">Today's P/L</div>
          <div className={`text-lg font-semibold ${todayPnl >= 0 ? "text-emerald-600" : "text-red-500"}`}>
            {todayPnl >= 0 ? "+" : ""}
            {todayPnl.toFixed(2)} USDC
          </div>
        </div>
        <div>
          <div className="text-xs text-text-secondary">Total P/L</div>
          <div className={`text-lg font-semibold ${totalPnl >= 0 ? "text-emerald-600" : "text-red-500"}`}>
            {totalPnl >= 0 ? "+" : ""}
            {totalPnl.toFixed(2)} USDC
          </div>
        </div>
      </div>

      <Button variant="secondary" className="w-full gap-2">
        <Gift className="h-4 w-4" /> Claim Rewards
      </Button>
    </Card>
  );
}
