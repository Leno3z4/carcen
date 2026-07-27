import { useState } from "react";

import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";

import { parseEther } from "viem";

import { Button } from "@/components/ui/Button";

import type { Market } from "@/types/market";

import { MARKET_ADDRESS } from "@/lib/contract";
import { PREDICTION_MARKET_ABI } from "@/lib/abi";

export default function TradePanel({
  market,
}: {
  market: Market;
}) {
  const { isConnected } = useAccount();

  const {
    writeContract,
    data: hash,
    isPending,
  } = useWriteContract();

  const {
    isLoading: isConfirming,
  } = useWaitForTransactionReceipt({
    hash,
  });

  const [side, setSide] =
    useState<"YES" | "NO">("YES");

  const [amount, setAmount] =
    useState("");

  const busy =
    isPending || isConfirming;

  function handleTrade() {
    if (!amount) return;

    writeContract({
      address: MARKET_ADDRESS,
      abi: PREDICTION_MARKET_ABI,
      functionName: "deposit",
      args: [
        BigInt(market.id),
        side === "YES" ? 0 : 1,
      ],
      value: parseEther(amount),
    });
  }

  return (
    <div className="rounded-[30px] border border-blue-100 bg-white p-7 shadow-[0_20px_50px_rgba(59,130,246,.08)]">

      <div className="mb-6">

        <h3 className="text-xl font-semibold">
          Place Prediction
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Stake your USDC on the outcome.
        </p>

      </div>

      <div className="grid grid-cols-2 gap-3">

        <Button
          variant={
            side === "YES"
              ? "primary"
              : "secondary"
          }
          onClick={() => setSide("YES")}
        >
          YES
        </Button>

        <Button
          variant={
            side === "NO"
              ? "primary"
              : "secondary"
          }
          onClick={() => setSide("NO")}
        >
          NO
        </Button>

      </div>

      <div className="mt-6">

        <label className="mb-2 block text-sm font-medium">
          Amount
        </label>

        <input
          type="number"
          placeholder="0.00 USDC"
          value={amount}
          onChange={(e) =>
            setAmount(e.target.value)
          }
          className="w-full rounded-2xl border border-blue-100 bg-blue-50/50 px-5 py-4 outline-none transition focus:border-blue-400"
        />

      </div>

      <Button
        className="mt-7 w-full"
        disabled={
          !isConnected ||
          busy ||
          !amount
        }
        onClick={handleTrade}
      >
        {isPending
          ? "Confirm in Wallet..."
          : isConfirming
          ? "Processing..."
          : `Trade ${side}`}
      </Button>

    </div>
  );
}
