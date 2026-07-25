import MarketCard from "./MarketCard";
import { Skeleton } from "@/components/shared/Skeleton";
import { Card } from "@/components/ui/Card";
import type { Market } from "@/types/market";

export default function MarketGrid({
  markets,
  isLoading,
}: {
  markets: Market[];
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-64" />
        ))}
      </div>
    );
  }

  if (markets.length === 0) {
    return (
      <Card className="flex min-h-[280px] items-center justify-center text-center">
        <div className="space-y-2">
          <p className="text-base font-medium text-text-primary">
            No markets match your filters yet.
          </p>
          <p className="text-sm text-text-secondary">
            Clear the filters to see the full feed.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {markets.map((m) => (
        <MarketCard key={m.id} market={m} />
      ))}
    </div>
  );
}
