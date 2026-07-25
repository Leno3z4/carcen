import { useEffect, useState } from "react";
import { fetchSnapshots } from "@/lib/snapshots";
import type { SnapshotPoint } from "@/types/market";

export function useSnapshots(marketId: number | undefined) {
  const [data, setData] = useState<SnapshotPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (marketId === undefined) return;
    let cancelled = false;
    setIsLoading(true);

    fetchSnapshots(marketId).then((points) => {
      if (!cancelled) {
        setData(points);
        setIsLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [marketId]);

  return { data, isLoading };
}
