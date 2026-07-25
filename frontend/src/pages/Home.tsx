import { useState, useMemo } from "react";
import { useMarkets } from "@/hooks/useMarkets";
import MarketGrid from "@/components/market/MarketGrid";
import MarketFilters, { type FilterState } from "@/components/market/MarketFilters";

export default function Home() {
  const { markets, isLoading } = useMarkets();
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    platform: "all",
    metric: "all",
    maxDurationHours: "all",
  });

  const filtered = useMemo(() => {
    const now = Math.floor(Date.now() / 1000);
    return markets.filter((m) => {
      if (filters.search && !m.username.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      if (filters.platform !== "all" && m.platform !== filters.platform) return false;
      if (filters.metric !== "all" && m.metricType !== filters.metric) return false;
      if (filters.maxDurationHours !== "all") {
        const remainingHours = (Number(m.closeTime) - now) / 3600;
        if (remainingHours > filters.maxDurationHours) return false;
      }
      return true;
    });
  }, [markets, filters]);

  return (
    <div>
      <MarketFilters filters={filters} onChange={setFilters} />
      <MarketGrid markets={filtered} isLoading={isLoading} />
    </div>
  );
}
