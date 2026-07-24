type ProgressIndicatorProps = {
  current: number;
  target: number;
};

export default function ProgressIndicator({
  current,
  target,
}: ProgressIndicatorProps) {
  const progress = Math.min((current / target) * 100, 100);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm text-neutral-600">
        <span>{current.toLocaleString()}</span>
        <span>{target.toLocaleString()}</span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-neutral-200">
        <div
          className="h-full rounded-full bg-blue-600 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
