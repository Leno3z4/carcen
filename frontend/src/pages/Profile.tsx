import { usePositions } from "@/hooks/usePositions";

import ProfileCard from "@/components/profile/ProfileCard";
import PositionsList from "@/components/portfolio/PositionsList";

export default function Profile() {
  const { positions, isLoading } =
    usePositions();

  const resolved = positions.filter(
    (p) => p.resolved
  );

  const wins = resolved.filter(
    (p) => p.won
  );

  const losses = resolved.filter(
    (p) => !p.won
  );

  const accuracy =
    resolved.length === 0
      ? 0
      : (wins.length / resolved.length) * 100;

  const totalMarkets = new Set(
    positions.map((p) => p.marketId)
  ).size;

  const winnings = wins.reduce(
    (sum, p) =>
      sum + Number(p.amount) / 1e18,
    0
  );

  const lossesTotal = losses.reduce(
    (sum, p) =>
      sum + Number(p.amount) / 1e18,
    0
  );

  const pnl = winnings - lossesTotal;

  return (
    <div className="space-y-8">

      <section className="rounded-[34px] border border-blue-100 bg-gradient-to-r from-blue-50 via-sky-50 to-white p-8 shadow-[0_20px_60px_rgba(59,130,246,.08)]">

        <h1 className="text-4xl font-bold text-slate-900">
          Profile
        </h1>

        

      </section>

      <div className="grid gap-8 lg:grid-cols-[340px,1fr]">

        <ProfileCard
          accuracy={accuracy}
          marketsParticipated={totalMarkets}
          totalWinnings={winnings}
          totalPnl={pnl}
        />

        {isLoading ? (
          <div className="rounded-3xl border border-blue-100 bg-white p-10">
            Loading...
          </div>
        ) : (
          <PositionsList positions={positions} />
        )}

      </div>

    </div>
  );
}
