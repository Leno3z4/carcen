import { Platform, MetricType } from "@/types/market";
import SearchBar from "@/components/shared/SearchBar";
import { cn } from "@/lib/utils";

export interface FilterState {
  search: string;
  platform: Platform | "all";
  metric: MetricType | "all";
  maxDurationHours: number | "all";
}

const DURATION_OPTIONS: { label: string; hours: number }[] = [
  { label: "1 Hour", hours: 1 },
  { label: "3 Hours", hours: 3 },
  { label: "6 Hours", hours: 6 },
  { label: "10 Hours", hours: 10 },
];

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-full text-sm font-medium transition-colors border",
        active
          ? "bg-arc-blue text-white border-arc-blue"
          : "bg-white text-text-secondary border-black/10 hover:border-black/20"
      )}
    >
      {children}
    </button>
  );
}

export default function MarketFilters({
  filters,
  onChange,
}: {
  filters: FilterState;
  onChange: (next: FilterState) => void;
}) {
  return (
    <div className="space-y-3 mb-6">
      <SearchBar onSearch={(search) => onChange({ ...filters, search })} />

      <div className="flex flex-wrap gap-2">
        <Pill active={filters.platform === "all"} onClick={() => onChange({ ...filters, platform: "all" })}>
          All Platforms
        </Pill>
        <Pill
          active={filters.platform === Platform.YOUTUBE}
          onClick={() => onChange({ ...filters, platform: Platform.YOUTUBE })}
        >
          YouTube
        </Pill>
        <Pill active={filters.platform === Platform.X} onClick={() => onChange({ ...filters, platform: Platform.X })}>
          X
        </Pill>
      </div>

      <div className="flex flex-wrap gap-2">
        <Pill active={filters.metric === "all"} onClick={() => onChange({ ...filters, metric: "all" })}>
          All Metrics
        </Pill>
        <Pill
          active={filters.metric === MetricType.VIEWS}
          onClick={() => onChange({ ...filters, metric: MetricType.VIEWS })}
        >
          Views
        </Pill>
        <Pill
          active={filters.metric === MetricType.FOLLOWERS}
          onClick={() => onChange({ ...filters, metric: MetricType.FOLLOWERS })}
        >
          Followers
        </Pill>
      </div>

      <div className="flex flex-wrap gap-2">
        <Pill
          active={filters.maxDurationHours === "all"}
          onClick={() => onChange({ ...filters, maxDurationHours: "all" })}
        >
          Any Duration
        </Pill>
        {DURATION_OPTIONS.map((opt) => (
          <Pill
            key={opt.hours}
            active={filters.maxDurationHours === opt.hours}
            onClick={() => onChange({ ...filters, maxDurationHours: opt.hours })}
          >
            {opt.label}
          </Pill>
        ))}
      </div>
    </div>
  );
}
