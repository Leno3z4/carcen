import { useEffect } from "react";
import { useReadContract, useWatchContractEvent } from "wagmi";
import { PREDICTION_MARKET_ABI } from "@/lib/abi";
import { MARKET_ADDRESS } from "@/lib/contract";
import type { Market } from "@/types/market";

/** Fetches a single market and re-fetches automatically whenever a new
 * Deposited event fires for it, so pool balances update live without the
 * user needing to refresh the page. */
export function useMarket(marketId: number | undefined) {
  const enabled = marketId !== undefined;

  const { data, isLoading, refetch } = useReadContract({
    address: MARKET_ADDRESS,
    abi: PREDICTION_MARKET_ABI,
    functionName: "getMarket",
    args: enabled ? [BigInt(marketId!)] : undefined,
    query: { enabled },
  });

  useWatchContractEvent({
    address: MARKET_ADDRESS,
    abi: PREDICTION_MARKET_ABI,
    eventName: "Deposited",
    enabled,
    onLogs(logs) {
      const relevant = logs.some(
        (log: any) => enabled && log.args.marketId === BigInt(marketId!)
      );
      if (relevant) refetch();
    },
  });

  useEffect(() => {
    if (enabled) refetch();
  }, [marketId]); // eslint-disable-line react-hooks/exhaustive-deps

  const market: Market | undefined = data
    ? ({ id: marketId, ...(data as any) } as Market)
    : undefined;

  return { market, isLoading, refetch };
}
