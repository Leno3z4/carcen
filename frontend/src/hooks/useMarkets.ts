import { useReadContract, useReadContracts } from "wagmi";
import { PREDICTION_MARKET_ABI } from "@/lib/abi";
import { MARKET_ADDRESS } from "@/lib/contract";
import type { Market } from "@/types/market";

/** Fetches every market via a batched multicall (one RPC round trip instead
 * of N sequential calls) rather than looping getMarket() one at a time. */
export function useMarkets() {
  const { data: nextIdRaw, isLoading: loadingCount } = useReadContract({
    address: MARKET_ADDRESS,
    abi: PREDICTION_MARKET_ABI,
    functionName: "nextMarketId",
  });

  const count = nextIdRaw ? Number(nextIdRaw) : 0;

  const contracts = Array.from({ length: count }, (_, i) => ({
    address: MARKET_ADDRESS,
    abi: PREDICTION_MARKET_ABI,
    functionName: "getMarket" as const,
    args: [BigInt(i)] as const,
  }));

  const { data, isLoading: loadingMarkets } = useReadContracts({
    contracts,
    query: { enabled: count > 0 },
  });

  const markets: Market[] = (data ?? [])
    .map((result, i) => {
      if (result.status !== "success" || !result.result) return null;
      const m = result.result as any;
      return {
        id: i,
        question: m.question,
        closeTime: m.closeTime,
        outcome: m.outcome,
        yesPool: m.yesPool,
        noPool: m.noPool,
        platform: m.platform,
        username: m.username,
        videoId: m.videoId,
        metricType: m.metricType,
        targetValue: m.targetValue,
        measuredValue: m.measuredValue,
      } as Market;
    })
    .filter((m): m is Market => m !== null);

  return { markets, isLoading: loadingCount || loadingMarkets };
}
