import { Link } from "react-router-dom";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import CountdownTimer from "@/components/market/CountdownTimer";
import { Outcome } from "@/types/market";
import type { Position } from "@/hooks/usePositions";

function PositionRow({ position }: { position: Position }) {
  const amount = Number(position.amount) / 1e18;

  return (
    <Link
      to={`/market/${position.marketId}`}
      className="flex items-center justify-between py-3 border-b border-black/5 last:border-0"
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{position.question}</p>
        <div className="flex items-center gap-2 mt-1">
          <Badge variant={position.side === Outcome.YES ? "yes" : "no"}>
            {position.side === Outcome.YES ? "YES" : "NO"}
          </Badge>
          <span className="text-xs text-text-secondary">{amount.toFixed(2)} USDC</span>
        </div>
      </div>
      <div className="text-right text-xs text-text-secondary">
        {position.resolved ? (
          <span className={position.won ? "text-emerald-600" : "text-red-500"}>
            {position.won ? "Won" : "Lost"}
          </span>
        ) : (
          <CountdownTimer closeTime={position.closeTime} />
        )}
      </div>
    </Link>
  );
}

export default function PositionsList({ positions }: { positions: Position[] }) {
  const open = positions.filter((p) => !p.resolved);
  const resolved = positions.filter((p) => p.resolved);
  const claimable = resolved.filter((p) => p.won && !p.claimed);

  return (
    <div className="space-y-4">
      <Card>
        <h3 className="text-sm font-semibold mb-1">Open Positions</h3>
        {open.length === 0 ? (
          <p className="text-sm text-text-secondary py-4">No open positions.</p>
        ) : (
          open.map((p) => <PositionRow key={`${p.marketId}-${p.side}`} position={p} />)
        )}
      </Card>

      <Card>
        <h3 className="text-sm font-semibold mb-1">Claimable Rewards</h3>
        {claimable.length === 0 ? (
          <p className="text-sm text-text-secondary py-4">Nothing to claim right now.</p>
        ) : (
          claimable.map((p) => <PositionRow key={`${p.marketId}-${p.side}`} position={p} />)
        )}
      </Card>

      <Card>
        <h3 className="text-sm font-semibold mb-1">Resolved Markets</h3>
        {resolved.length === 0 ? (
          <p className="text-sm text-text-secondary py-4">No resolved positions yet.</p>
        ) : (
          resolved.map((p) => <PositionRow key={`${p.marketId}-${p.side}`} position={p} />)
        )}
      </Card>
    </div>
  );
}
