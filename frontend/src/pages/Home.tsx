import { useMemo, useState } from "react";
import MarketGrid from "@/components/market/MarketGrid";
import MarketFilters, { type FilterState } from "@/components/market/MarketFilters";
import { Card } from "@/components/ui/Card";
import type { Market } from "@/types/market";
import { useMarkets } from "@/hooks/useMarkets";

const demoMarkets: Market[] = [
  {
    id: 1,
    question: "Will this video reach 3,000,000 views within 3 hours?",
    closeTime: BigInt(Math.floor(Date.now() / 1000) + 60 * 60 * 2),
    outcome: 0,
    yesPool: 680000000000000000000n,
    noPool: 320000000000000000000n,
    platform: 1,
    username: "MrBeast",
    videoId: "",
    metricType: 1,
    targetValue: 3000000n,
    measuredValue: 2410000n,
  },
  {
    id: 2,
    question: "Will this stream reach 1,000,000 views within 6 hours?",
    closeTime: BigInt(Math.floor(Date.now() / 1000) + 60 * 60 * 4),
    outcome: 0,
    yesPool: 540000000000000000000n,
    noPool: 460000000000000000000n,
    platform: 1,
    username: "KaiCenat",
    videoId: "",
    metricType: 1,
    targetValue: 1000000n,
    measuredValue: 712000n,
  },
  {
    id: 3,
    question: "Will this account gain 10,000 followers within 1 hour?",
    closeTime: BigInt(Math.floor(Date.now() / 1000) + 60 * 60),
    outcome: 0,
    yesPool: 610000000000000000000n,
    noPool: 390000000000000000000n,
    platform: 0,
    username: "elonmusk",
    videoId: "",
    metricType: 0,
    targetValue: 10000n,
    measuredValue: 7350n,
  },
];

export default function Home() {
  const { markets, isLoading } = useMarkets();
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    platform: "all",
    metric: "all",
    maxDurationHours: "all",
  });

  const sourceMarkets = markets.length > 0 ? markets : demoMarkets;

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
            Live markets
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
            YouTube views and X growth
          </h1>
          <p className="max-w-2xl text-sm text-text-secondary">
            Browse short-duration prediction markets. No hero section, just the feed.
          </p>
        </div>

        <div className="rounded-2xl border border-black/5 bg-white px-4 py-3 text-sm text-text-secondary shadow-sm">
          {filtered.length} markets
        </div>
      </section>

      <section id="markets" className="space-y-4">
        <Card className="space-y-4">
          <MarketFilters filters={filters} onChange={setFilters} />
        </Card>

        <MarketGrid markets={filtered} isLoading={isLoading} />
      </section>
    </div>
  );
}
