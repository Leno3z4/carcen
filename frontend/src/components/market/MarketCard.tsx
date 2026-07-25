import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import ProbabilityBar from "./ProbabilityBar";
import CountdownTimer from "./CountdownTimer";
import { formatMetric, formatUsdc } from "@/lib/utils";
import { PLATFORM_LABELS, type Market } from "@/types/market";

function CreatorAvatar({ username }: { username: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black/5 text-xs font-semibold">
        {username.slice(0, 1).toUpperCase()}
      </div>
    );
  }

  return (
    <img
      src={`https://unavatar.io/youtube/${username}`}
      alt={username}
      className="h-8 w-8 rounded-full bg-black/5 object-cover"
      onError={() => setFailed(true)}
    />
  );
}

export default function MarketCard({ market }: { market: Market }) {
  const volume = market.yesPool + market.noPool;
  const progressPct =
    market.targetValue > 0n
      ? Math.min(
          100,
          (Number(market.measuredValue) / Number(market.targetValue)) * 100
        )
      : 0;

  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.15 }}>
      <Card className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreatorAvatar username={market.username} />
            <div>
              <div className="text-sm font-medium">{market.username}</div>
              <div className="text-xs text-text-secondary">
                {PLATFORM_LABELS[market.platform]}
              </div>
            </div>
          </div>
          <Badge variant="live">● Live</Badge>
        </div>

        <p className="text-sm font-medium leading-snug">{market.question}</p>

        <div className="space-y-1">
          <div className="flex justify-between text-xs text-text-secondary">
            <span>Current: {formatMetric(market.measuredValue)}</span>
            <span>Target: {formatMetric(market.targetValue)}</span>
          </div>

          <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/5">
            <div
              className="h-full bg-arc-blue transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        <ProbabilityBar yesPool={market.yesPool} noPool={market.noPool} />

        <div className="flex items-center justify-between pt-1 text-xs text-text-secondary">
          <span>Volume: {formatUsdc(volume, 0)} USDC</span>
          <CountdownTimer closeTime={market.closeTime} />
        </div>

        <Link to={`/market/${market.id}`}>
          <Button className="mt-1 w-full">Trade</Button>
        </Link>
      </Card>
    </motion.div>
  );
}