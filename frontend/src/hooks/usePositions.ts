import { useAccount, useReadContracts } from "wagmi";
import { PREDICTION_MARKET_ABI } from "@/lib/abi";
import { MARKET_ADDRESS } from "@/lib/contract";
import { useMarkets } from "./useMarkets";
import { Outcome } from "@/types/market";

export interface Position {
  marketId: number;
  question: string;
  side: Outcome.YES | Outcome.NO;
  amount: bigint;
  resolved: boolean;
  won: boolean;
  claimed: boolean;
  closeTime: bigint;
}

/** Reads the connected wallet's stake across every market, on both sides
 * (a wallet could in theory have staked both YES and NO on the same market). */
export function usePositions() {
  const { address } = useAccount();
  const { markets, isLoading: loadingMarkets } = useMarkets();

  const stakeContracts = address
    ? markets.flatMap((m) => [
        {
          address: MARKET_ADDRESS,
          abi: PREDICTION_MARKET_ABI,
          functionName: "stakes" as const,
          args: [BigInt(m.id), address, Outcome.YES] as const,
        },
        {
          address: MARKET_ADDRESS,
          abi: PREDICTION_MARKET_ABI,
          functionName: "stakes" as const,
          args: [BigInt(m.id), address, Outcome.NO] as const,
        },
      ])
    : [];

  const { data, isLoading: loadingStakes } = useReadContracts({
    contracts: stakeContracts,
    query: { enabled: !!address && markets.length > 0 },
  });

  const positions: Position[] = [];
  if (data) {
    markets.forEach((m, i) => {
      const yesStake = data[i * 2]?.result as bigint | undefined;
      const noStake = data[i * 2 + 1]?.result as bigint | undefined;

      if (yesStake && yesStake > 0n) {
        positions.push({
          marketId: m.id,
          question: m.question,
          side: Outcome.YES,
          amount: yesStake,
          resolved: m.outcome !== Outcome.UNRESOLVED,
          won: m.outcome === Outcome.YES,
          claimed: false,
          closeTime: m.closeTime,
        });
      }
      if (noStake && noStake > 0n) {
        positions.push({
          marketId: m.id,
          question: m.question,
          side: Outcome.NO,
          amount: noStake,
          resolved: m.outcome !== Outcome.UNRESOLVED,
          won: m.outcome === Outcome.NO,
          claimed: false,
          closeTime: m.closeTime,
        });
      }
    });
  }

  return { positions, isLoading: loadingMarkets || loadingStakes };
}
