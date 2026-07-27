import SearchBar from "@/components/shared/SearchBar";
import { Platform, MetricType } from "@/types/market";
import { cn } from "@/lib/utils";

export interface FilterState {
  search: string;
  platform: Platform | "all";
  metric: MetricType | "all";
  maxDurationHours: number | "all";
}

interface Props {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

function Pill({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-2xl border px-5 py-2.5 text-sm font-medium transition-all duration-200",
        active
          ? "border-blue-500 bg-gradient-to-r from-blue-500 to-sky-500 text-white shadow-lg shadow-blue-500/20"
          : "border-blue-100 bg-white text-slate-600 hover:border-blue-300 hover:bg-blue-50 hover:text-slate-900"
      )}
    >
      {children}
    </button>
  );
}

export default function MarketFilters({
  filters,
  onChange,
}: Props) {
  return (
    <div className="space-y-5 rounded-3xl border border-blue-100 bg-white/90 p-6 shadow-[0_12px_35px_rgba(59,130,246,.08)]">

      <SearchBar
        onSearch={(search: string) =>
          onChange({
            ...filters,
            search,
          })
        }
        placeholder="Search YouTube creators..."
      />

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Platform
        </p>

        <div className="flex flex-wrap gap-3">
          <Pill
            active={filters.platform === "all"}
            onClick={() =>
              onChange({
                ...filters,
                platform: "all",
              })
            }
          >
            All
          </Pill>

          <Pill
            active={filters.platform === Platform.YOUTUBE}
            onClick={() =>
              onChange({
                ...filters,
                platform: Platform.YOUTUBE,
              })
            }
          >
            YouTube
          </Pill>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Metric
        </p>

        <div className="flex flex-wrap gap-3">
          <Pill
            active={filters.metric === "all"}
            onClick={() =>
              onChange({
                ...filters,
                metric: "all",
              })
            }
          >
            All
          </Pill>

          <Pill
            active={filters.metric === MetricType.VIEWS}
            onClick={() =>
              onChange({
                ...filters,
                metric: MetricType.VIEWS,
              })
            }
          >
            Views
          </Pill>
        </div>
      </div>
    </div>
  );
}
