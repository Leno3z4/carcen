import { useMemo, useState } from "react";
import MarketGrid from "@/components/market/MarketGrid";
import MarketFilters, {
  type FilterState,
} from "@/components/market/MarketFilters";
import { useMarkets } from "@/hooks/useMarkets";

export default function Home() {
  const { markets, isLoading } = useMarkets();

  const [filters, setFilters] = useState<FilterState>({
    search: "",
    platform: "all",
    metric: "all",
    maxDurationHours: "all",
  });

  const filteredMarkets = useMemo(() => {
    const now = Math.floor(Date.now() / 1000);

    return markets.filter((m) => {
      if (
        filters.search &&
        !m.username
          .toLowerCase()
          .includes(filters.search.toLowerCase())
      )
        return false;

      if (
        filters.platform !== "all" &&
        m.platform !== filters.platform
      )
        return false;

      if (
        filters.metric !== "all" &&
        m.metricType !== filters.metric
      )
        return false;

      if (filters.maxDurationHours !== "all") {
        const hours =
          (Number(m.closeTime) - now) / 3600;

        if (hours > filters.maxDurationHours)
          return false;
      }

      return true;
    });
  }, [markets, filters]);

  return (
    <div className="space-y-8">

      <section className="overflow-hidden rounded-[34px] border border-blue-100 bg-gradient-to-br from-sky-50 via-blue-50 to-white p-10 shadow-[0_20px_60px_rgba(59,130,246,.10)]">

        <div className="max-w-3xl">

          <span className="rounded-full bg-blue-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-blue-700">
            Social Prediction Market
          </span>

          <h1 className="mt-6 text-5xl font-bold tracking-tight text-slate-900">
            Predict creator growth before everyone else.
          </h1>

          <p className="mt-5 text-lg leading-8 text-slate-600">
            Trade prediction markets based on YouTube
            creator performance using USDC.
          </p>

          <div className="mt-10 flex gap-10">

            <div>
              <p className="text-3xl font-bold text-slate-900">
                {markets.length}
              </p>
              <p className="text-sm text-slate-500">
                Active Markets
              </p>
            </div>

            <div>
              <p className="text-3xl font-bold text-slate-900">
                24/7
              </p>
              <p className="text-sm text-slate-500">
                Live Trading
              </p>
            </div>

          </div>

        </div>

      </section>

      <MarketFilters
        filters={filters}
        onChange={setFilters}
      />

      <MarketGrid
        markets={filteredMarkets}
        isLoading={isLoading}
        hasAnyMarkets={markets.length > 0}
      />

    </div>
  );
}
