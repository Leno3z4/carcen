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
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 font-semibold text-white shadow">
        {username.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <img
      src={`https://unavatar.io/youtube/${username}`}
      alt={username}
      onError={() => setFailed(true)}
      className="h-11 w-11 rounded-2xl object-cover ring-2 ring-blue-100"
    />
  );
}

export default function MarketCard({ market }: { market: Market }) {
  const volume = market.yesPool + market.noPool;

  const progress =
    market.targetValue > 0n
      ? Math.min(
          100,
          (Number(market.measuredValue) /
            Number(market.targetValue)) *
            100
        )
      : 0;

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: .2 }}
    >
      <Card className="overflow-hidden">

        <div className="mb-5 flex items-center justify-between">

          <div className="flex items-center gap-3">

            <CreatorAvatar username={market.username} />

            <div>

              <h3 className="font-semibold text-slate-900">
                {market.username}
              </h3>

              <p className="text-xs text-slate-500">
                {PLATFORM_LABELS[market.platform]}
              </p>

            </div>

          </div>

          <Badge variant="live">
            LIVE
          </Badge>

        </div>

        <h2 className="mb-5 text-lg font-semibold leading-7 text-slate-900">
          {market.question}
        </h2>

        <div className="mb-4">

          <div className="mb-2 flex justify-between text-xs text-slate-500">

            <span>
              {formatMetric(market.measuredValue)}
            </span>

            <span>
              {formatMetric(market.targetValue)}
            </span>

          </div>

          <div className="h-2 overflow-hidden rounded-full bg-blue-100">

            <div
              className="h-full rounded-full bg-gradient-to-r from-sky-400 to-blue-600 transition-all duration-700"
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

        </div>

        <ProbabilityBar
          yesPool={market.yesPool}
          noPool={market.noPool}
        />

        <div className="mt-5 flex items-center justify-between text-sm">

          <div>

            <p className="text-slate-400">
              Volume
            </p>

            <p className="font-semibold">
              {formatUsdc(volume,0)} USDC
            </p>

          </div>

          <CountdownTimer
            closeTime={market.closeTime}
          />

        </div>

        <Link
          to={`/market/${market.id}`}
          className="block mt-6"
        >
          <Button className="w-full">
            Trade Market
          </Button>
        </Link>

      </Card>
    </motion.div>
  );
}
