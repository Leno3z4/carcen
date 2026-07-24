import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

type DataPoint = {
  t: number;
  v: number;
};

type GrowthChartProps = {
  data: DataPoint[];
};

export default function GrowthChart({
  data,
}: GrowthChartProps) {
  if (data.length < 2) {
    return (
      <div className="flex h-80 items-center justify-center rounded-3xl border border-neutral-200 bg-white text-sm text-neutral-500">
        Not enough data yet.
      </div>
    );
  }

  return (
    <div className="h-80 rounded-3xl border border-neutral-200 bg-white p-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis
            dataKey="t"
            tickFormatter={(value) =>
              new Date(value * 1000).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            }
          />

          <YAxis />

          <Tooltip
            labelFormatter={(value) =>
              new Date(Number(value) * 1000).toLocaleString()
            }
          />

          <Line
            type="monotone"
            dataKey="v"
            stroke="#2563EB"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
