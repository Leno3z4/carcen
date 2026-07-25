import { useAccount } from "wagmi";
import { Card } from "@/components/ui/Card";
import { truncateAddress } from "@/lib/utils";

export default function ProfileCard({
  accuracy,
  marketsParticipated,
  totalWinnings,
}: {
  accuracy: number;
  marketsParticipated: number;
  totalWinnings: number;
}) {
  const { address } = useAccount();

  return (
    <Card className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-14 w-14 rounded-full bg-black/5 flex items-center justify-center text-lg font-semibold">
          {address ? address.slice(2, 3).toUpperCase() : "?"}
        </div>
        <div>
          <div className="font-semibold">{address ? truncateAddress(address) : "Not connected"}</div>
          <div className="text-xs text-text-secondary">{address ?? "—"}</div>
        </div>
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
    </Card>
  );
}
