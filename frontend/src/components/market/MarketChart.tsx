import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useSnapshots } from "@/hooks/useSnapshots";
import { formatMetric } from "@/lib/utils";

export default function MarketChart({ marketId }: { marketId: number }) {
  const { data, isLoading } = useSnapshots(marketId);

  if (isLoading) {
    return <div className="h-64 rounded-control bg-black/5 animate-pulse" />;
  }

  if (data.length < 2) {
    return (
      <div className="h-64 rounded-control bg-black/5 flex items-center justify-center text-sm text-text-secondary">
        Not enough data yet — check back after the next snapshot.
      </div>
    );
  }

  const chartData = data.map((point) => ({
    time: new Date(point.t * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    value: point.v,
  }));

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <XAxis dataKey="time" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
          <YAxis
            tickFormatter={(v) => formatMetric(v)}
            tick={{ fontSize: 11, fill: "#6B7280" }}
            axisLine={false}
            tickLine={false}
            width={50}
          />
          <Tooltip formatter={(v: number) => formatMetric(v)} />
          <Line type="monotone" dataKey="value" stroke="#2563EB" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
