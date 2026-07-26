import { useAccount, useBalance } from "wagmi";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { truncateAddress } from "@/lib/utils";
import { Copy, Gift } from "lucide-react";

interface ProfileCardProps {
  accuracy: number;
  marketsParticipated: number;
  totalWinnings: number;
  totalPnl: number;
}

export default function ProfileCard({
  accuracy,
  marketsParticipated,
  totalWinnings,
  totalPnl,
}: ProfileCardProps) {
  const { address } = useAccount();
  const { data: balance } = useBalance({ address });

  if (!address) {
    return (
      <Card>
        <p className="text-sm text-text-secondary">Connect your wallet to view your profile.</p>
      </Card>
    );
  }

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-14 w-14 rounded-full bg-black/5 flex items-center justify-center text-lg font-semibold">
            {address.slice(2, 3).toUpperCase()}
          </div>
          <div>
            <div className="font-semibold">{truncateAddress(address)}</div>
            <div className="text-xs text-text-secondary">{address}</div>
          </div>
        </div>
        <button
          onClick={() => navigator.clipboard.writeText(address)}
          className="text-text-secondary hover:text-text-primary"
          title="Copy address"
        >
          <Copy className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        <div>
          <div className="text-lg font-semibold">{accuracy.toFixed(0)}%</div>
          <div className="text-xs text-text-secondary">Accuracy</div>
        </div>
        <div>
          <div className="text-lg font-semibold">{marketsParticipated}</div>
          <div className="text-xs text-text-secondary">Markets</div>
        </div>
        <div>
          <div className="text-lg font-semibold">{totalWinnings.toFixed(0)}</div>
          <div className="text-xs text-text-secondary">Winnings (USDC)</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 border-t border-black/5 pt-4">
        <div>
          <div className="text-xs text-text-secondary">Wallet Balance</div>
          <div className="text-lg font-semibold">
            {balance ? Number(balance.formatted).toFixed(2) : "0.00"} {balance?.symbol ?? "USDC"}
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
