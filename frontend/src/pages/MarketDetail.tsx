import { useParams } from "react-router-dom";
import { useMarket } from "@/hooks/useMarket";
import MarketChart from "@/components/market/MarketChart";
import TradePanel from "@/components/market/TradePanel";
import ProbabilityBar from "@/components/market/ProbabilityBar";
import CountdownTimer from "@/components/market/CountdownTimer";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/shared/Skeleton";
import { formatMetric, formatUsdc } from "@/lib/utils";
import { PLATFORM_LABELS } from "@/types/market";

export default function MarketDetail() {
  const { id } = useParams<{ id: string }>();
  const marketId = id ? Number(id) : undefined;
  const { market, isLoading } = useMarket(marketId);

  if (isLoading || !market) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-64" />
        </div>
        <Skeleton className="h-80" />
      </div>
    );
  }

  const volume = market.yesPool + market.noPool;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <span>{market.username}</span>
          <span>·</span>
          <span>{PLATFORM_LABELS[market.platform]}</span>
        </div>

        <h1 className="text-xl font-semibold leading-snug">{market.question}</h1>

        <div className="flex gap-6 text-sm">
          <div>
            <div className="text-text-secondary text-xs">Current</div>
            <div className="font-medium">{formatMetric(market.measuredValue)}</div>
          </div>
          <div>
            <div className="text-text-secondary text-xs">Target</div>
            <div className="font-medium">{formatMetric(market.targetValue)}</div>
          </div>
          <div>
            <div className="text-text-secondary text-xs">Closes in</div>
            <div className="font-medium">
              <CountdownTimer closeTime={market.closeTime} />
            </div>
          </div>
        </div>

        <Card>
          <MarketChart marketId={market.id} />
        </Card>

        <Card>
          <h3 className="text-sm font-semibold mb-3">Market Stats</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-text-secondary text-xs">Volume</div>
              <div className="font-medium">{formatUsdc(volume, 2)} USDC</div>
            </div>
            <div>
              <div className="text-text-secondary text-xs">Probability</div>
              <ProbabilityBar yesPool={market.yesPool} noPool={market.noPool} />
            </div>
          </div>
        </Card>
      </div>

      <Card className="h-fit sticky top-24">
        <h3 className="text-sm font-semibold mb-3">Trade</h3>
        <TradePanel market={market} />
      </Card>
    </div>
  );
}
