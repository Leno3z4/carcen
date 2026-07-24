type ProbabilityBarProps = {
  yes: number;
  no: number;
};

export default function ProbabilityBar({
  yes,
  no,
}: ProbabilityBarProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm font-medium">
        <span className="text-blue-600">YES {yes}%</span>
        <span className="text-neutral-600">NO {no}%</span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-neutral-200">
        <div
          className="h-full rounded-full bg-blue-600 transition-all duration-300"
          style={{ width: `${yes}%` }}
        />
      </div>
    </div>
  );
}
