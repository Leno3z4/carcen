import clsx from "clsx";

type SkeletonProps = {
  className?: string;
};

export default function Skeleton({
  className,
}: SkeletonProps) {
  return (
    <div
      className={clsx(
        "animate-pulse rounded-2xl bg-neutral-200",
        className
      )}
    />
  );
}
