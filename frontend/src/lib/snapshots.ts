import type { SnapshotPoint } from "@/types/market";
import { SNAPSHOT_BASE_URL } from "./contract";

/** Fetches a market's snapshot history for the growth chart. Returns an empty
 * array (not a throw) on 404, since brand-new markets won't have a snapshot
 * file yet — that's an expected state, not an error. */
export async function fetchSnapshots(marketId: number): Promise<SnapshotPoint[]> {
  if (!SNAPSHOT_BASE_URL) return [];

  try {
    const res = await fetch(`${SNAPSHOT_BASE_URL}/${marketId}.json`);
    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data)) return [];
    return data as SnapshotPoint[];
  } catch {
    return [];
  }
}
