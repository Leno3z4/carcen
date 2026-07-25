  import { useMemo, useState } from "react";
import MarketGrid from "@/components/market/MarketGrid";
import MarketFilters, { type FilterState } from "@/components/market/MarketFilters";
import { Card } from "@/components/ui/Card";
import { useMarkets } from "@/hooks/useMarkets";

export default function Home() {
  const { markets, isLoading } = useMarkets();

  const [filters, setFilters] = useState<FilterState>({
    search: "",
    platform: "all",
    metric: "all",
    maxDurationHours: "all",
  });

  const sourceMarkets = markets;

  const filtered = useMemo(() => {
    const now = Math.floor(Date.now() / 1000);

    return sourceMarkets.filter((m) => {
      if (
        filters.search &&
        !m.username.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false;
      }

      if (filters.platform !== "all" && m.platform !== filters.platform) {
        return false;
      }

      if (filters.metric !== "all" && m.metricType !== filters.metric) {
        return false;
      }

      if (filters.maxDurationHours !== "all") {
        const remainingHours = (Number(m.closeTime) - now) / 3600;
        if (remainingHours > filters.maxDurationHours) {
          return false;
        }
      }

      return true;
    });
  }, [sourceMarkets, filters]);

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.24em] text-text-secondary">
            Live Markets
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
            Predict where YouTube views are headed next.
          </h1>
        </div>

        <div className="rounded-2xl border border-black/5 bg-white px-4 py-3 text-sm text-text-secondary shadow-sm">
          {filtered.length} markets
        </div>
      </section>

      <section id="markets" className="space-y-4">
        <Card className="space-y-4">
          <MarketFilters filters={filters} onChange={setFilters} />
        </Card>

        <MarketGrid
          markets={filtered}
          isLoading={isLoading}
          hasAnyMarkets={sourceMarkets.length > 0}
        />
      </section>
    </div>
  );
}
