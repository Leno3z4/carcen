import { usePositions } from "@/hooks/usePositions";
import ProfileCard from "@/components/profile/ProfileCard";
import PositionsList from "@/components/portfolio/PositionsList";

export default function Profile() {
  const { positions, isLoading } = usePositions();

  const resolved = positions.filter((p) => p.resolved);
  const won = resolved.filter((p) => p.won);
  const lost = resolved.filter((p) => !p.won);
  const accuracy = resolved.length > 0 ? (won.length / resolved.length) * 100 : 0;
  const uniqueMarkets = new Set(positions.map((p) => p.marketId)).size;
  const totalWinnings = won.reduce((sum, p) => sum + Number(p.amount) / 1e18, 0);
  const lostAmount = lost.reduce((sum, p) => sum + Number(p.amount) / 1e18, 0);
  const totalPnl = -lostAmount; // conservative until real claim payout amounts are tracked

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <ProfileCard
          accuracy={accuracy}
          marketsParticipated={uniqueMarkets}
          totalWinnings={totalWinnings}
          totalPnl={totalPnl}
        />
      </div>
      <div className="lg:col-span-2">
        {isLoading ? (
          <div className="text-sm text-text-secondary">Loading positions...</div>
        ) : (
          <PositionsList positions={positions} />
        )}
      </div>
    </div>
  );
}
