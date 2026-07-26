import { useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { parseUnits } from "viem";
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
  const { writeContract, isPending } = useWriteContract();

  const [amount, setAmount] = useState("");
  const [side, setSide] = useState<"YES" | "NO">("YES");

  const handleTrade = () => {
    if (!amount || Number(amount) <= 0) return;

    writeContract({
      address: MARKET_ADDRESS,
      abi: PREDICTION_MARKET_ABI,
      functionName: "deposit",
      args: [
        BigInt(market.id),
        side === "YES" ? 1 : 2,
      ],
      value: parseUnits(amount, 6),
    });
  };

  return (
    <div className="space-y-4 rounded-3xl border border-border bg-card p-6">
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant={side === "YES" ? "primary" : "secondary"}
          onClick={() => setSide("YES")}
        >
          YES
        </Button>

        <Button
          variant={side === "NO" ? "primary" : "secondary"}
          onClick={() => setSide("NO")}
        >
          NO
        </Button>
      </div>

      <input
        type="number"
        placeholder="Amount (USDC)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none"
      />

      <Button
        className="w-full"
        disabled={!isConnected || isPending}
        onClick={handleTrade}
      >
        {isPending ? "Submitting..." : `Trade ${side}`}
      </Button>
    </div>
  );
}