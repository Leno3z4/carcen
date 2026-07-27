import MarketCard from "./MarketCard";
import { Skeleton } from "@/components/shared/Skeleton";
import { Card } from "@/components/ui/Card";
import type { Market } from "@/types/market";

export default function MarketGrid({
  markets,
  isLoading,
  hasAnyMarkets,
}: {
  markets: Market[];
  isLoading: boolean;
  hasAnyMarkets: boolean;
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-[340px] rounded-3xl"
          />
        ))}
      </div>
    );
  }

  if (markets.length === 0) {
    return (
      <Card className="flex min-h-[320px] flex-col items-center justify-center text-center">

        <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-50 text-4xl">
          📊
        </div>

        <h2 className="text-xl font-semibold text-slate-900">
          {hasAnyMarkets
            ? "No markets match your filters"
            : "No live markets yet"}
        </h2>

        <p className="mt-3 max-w-md text-slate-500">
          {hasAnyMarkets
            ? "Try adjusting or clearing your filters to discover more prediction markets."
            : "Creator prediction markets will appear here as soon as they are created."}
        </p>

      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 2xl:grid-cols-3">
      {markets.map((market) => (
        <MarketCard
          key={market.id}
          market={market}
        />
      ))}
    </div>
  );
}
