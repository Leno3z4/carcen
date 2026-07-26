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
        "rounded-full border px-4 py-2 text-sm transition-all",
        active
          ? "border-arc-blue bg-arc-blue text-white"
          : "border-border bg-card text-text-secondary hover:border-arc-blue hover:text-text-primary"
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
    <div className="space-y-4">
      <SearchBar
        onSearch={(search: string) =>
          onChange({
            ...filters,
            search,
          })
        }
        placeholder="Search creators..."
      />

      <div className="flex flex-wrap gap-2">
        <Pill
          active={filters.platform === "all"}
          onClick={() =>
            onChange({
              ...filters,
              platform: "all",
            })
          }
        >
          All Platforms
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

      <div className="flex flex-wrap gap-2">
        <Pill
          active={filters.metric === "all"}
          onClick={() =>
            onChange({
              ...filters,
              metric: "all",
            })
          }
        >
          All Metrics
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
  );
}