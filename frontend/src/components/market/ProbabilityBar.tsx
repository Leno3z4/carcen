/** YES/NO split derived purely from pool ratio — yesPool / (yesPool + noPool).
 * Not a separate oracle or pricing feed, just a direct read of contract state. */
export default function ProbabilityBar({
  yesPool,
  noPool,
}: {
  yesPool: bigint;
  noPool: bigint;
}) {
  const total = yesPool + noPool;
  const yesPct = total > 0n ? Number((yesPool * 10000n) / total) / 100 : 50;
  const noPct = 100 - yesPct;

  return (
    <div>
      <div className="flex justify-between text-sm font-medium mb-1">
        <span className="text-emerald-600">YES {yesPct.toFixed(0)}%</span>
        <span className="text-red-500">NO {noPct.toFixed(0)}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-red-100 overflow-hidden">
        <div
          className="h-full bg-emerald-400 transition-all duration-500"
          style={{ width: `${yesPct}%` }}
        />
      </div>
    </div>
  );
}
