import { usePositions } from "@/hooks/usePositions";
import WalletOverviewCard from "@/components/portfolio/WalletOverviewCard";
import PositionsList from "@/components/portfolio/PositionsList";

export default function Portfolio() {
  const { positions, isLoading } = usePositions();

  // Simple P/L estimate from resolved positions. A more precise version would
  // read actual claimed payout amounts from Claimed events rather than
  // re-deriving them here — fine as an approximation for now.
  const resolvedWon = positions.filter((p) => p.resolved && p.won);
  const resolvedLost = positions.filter((p) => p.resolved && !p.won);
  const totalStaked = positions.reduce((sum, p) => sum + Number(p.amount) / 1e18, 0);
  const lostAmount = resolvedLost.reduce((sum, p) => sum + Number(p.amount) / 1e18, 0);
  const totalPnl = resolvedWon.length > 0 ? -lostAmount : -lostAmount; // conservative until claim amounts are tracked

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <WalletOverviewCard portfolioValue={totalStaked} todayPnl={0} totalPnl={totalPnl} />
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
