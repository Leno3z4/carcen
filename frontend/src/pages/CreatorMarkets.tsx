import { useParams } from "react-router-dom";
import { useMarkets } from "@/hooks/useMarkets";
import MarketGrid from "@/components/market/MarketGrid";
import { PLATFORM_LABELS, Platform } from "@/types/market";

export default function CreatorMarkets() {
  const { platform, username } = useParams<{
    platform: string;
    username: string;
  }>();

  const { markets, isLoading } = useMarkets();

  const platformEnum = platform
    ? (Object.values(Platform).find(
        (p) =>
          typeof p === "number" &&
          PLATFORM_LABELS[p as Platform].toLowerCase() ===
            platform.toLowerCase()
      ) as Platform | undefined)
    : undefined;

  const creatorMarkets = markets.filter(
    (m) =>
      m.username.toLowerCase() === username?.toLowerCase() &&
      (platformEnum === undefined || m.platform === platformEnum)
  );

  return (
    <div>
      <h1 className="mb-4 text-lg font-semibold">
        Markets for {username} {platform ? `(${platform})` : ""}
      </h1>

      <MarketGrid
        markets={creatorMarkets}
        isLoading={isLoading}
        hasAnyMarkets={markets.length > 0}
      />
    </div>
  );
}