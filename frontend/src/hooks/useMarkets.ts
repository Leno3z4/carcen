import { useCallback, useEffect, useState } from "react";
import type { Address } from "viem";
import { publicClient } from "./useWallet";
import { PREDICTION_MARKET_ADDRESS, predictionMarketAbi } from "../lib/contract";

export interface MarketData {
  id: bigint;
  question: string;
  closeTime: bigint;
  outcome: number; // 0 unresolved, 1 yes, 2 no
  yesPool: bigint;
  noPool: bigint;
  impliedYesBps: bigint;
  espnLeaguePath: string;
  espnEventId: string;
}

export function useMarkets() {
  const [markets, setMarkets] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const nextId = await publicClient.readContract({
        address: PREDICTION_MARKET_ADDRESS,
        abi: predictionMarketAbi,
        functionName: "nextMarketId",
      });

      const ids = Array.from({ length: Number(nextId) }, (_, i) => BigInt(i));

      const results = await Promise.all(
        ids.map(async (id) => {
          const [question, closeTime, outcome, yesPool, noPool, espnLeaguePath, espnEventId] =
            await publicClient.readContract({
              address: PREDICTION_MARKET_ADDRESS,
              abi: predictionMarketAbi,
              functionName: "getMarket",
              args: [id],
            });
          const impliedYesBps = await publicClient.readContract({
            address: PREDICTION_MARKET_ADDRESS,
            abi: predictionMarketAbi,
            functionName: "impliedYesBps",
            args: [id],
          });
          return { id, question, closeTime, outcome, yesPool, noPool, impliedYesBps, espnLeaguePath, espnEventId };
        })
      );

      // newest first
      setMarkets(results.reverse());
    } catch {
      setError(
        "Couldn't load markets. Check that VITE_MARKET_ADDRESS is set and points to a deployed contract on Arc Testnet."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { markets, loading, error, refresh };
}

export async function fetchUserPosition(marketId: bigint, user: Address) {
  const [yesAmount, noAmount, hasClaimed] = await publicClient.readContract({
    address: PREDICTION_MARKET_ADDRESS,
    abi: predictionMarketAbi,
    functionName: "userPosition",
    args: [marketId, user],
  });
  return { yesAmount, noAmount, hasClaimed };
}
