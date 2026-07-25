import { usePositions } from "@/hooks/usePositions";
import ProfileCard from "@/components/profile/ProfileCard";

export default function Profile() {
  const { positions } = usePositions();

  const resolved = positions.filter((p) => p.resolved);
  const won = resolved.filter((p) => p.won);
  const accuracy = resolved.length > 0 ? (won.length / resolved.length) * 100 : 0;
  const uniqueMarkets = new Set(positions.map((p) => p.marketId)).size;
  const totalWinnings = won.reduce((sum, p) => sum + Number(p.amount) / 1e18, 0);

  return (
    <div className="max-w-md mx-auto">
      <ProfileCard
        accuracy={accuracy}
        marketsParticipated={uniqueMarkets}
        totalWinnings={totalWinnings}
      />
    </div>
  );
}
