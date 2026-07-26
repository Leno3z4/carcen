import { useState } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";
import { Button } from "@/components/ui/Button";
import type { Market } from "@/types/market";
import { MARKET_ADDRESS } from "@/lib/contract";
import { PREDICTION_MARKET_ABI } from "@/lib/abi";

export default function TradePanel({ market }: { market: Market }) {
  const { isConnected } = useAccount();
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash });

  const [amount, setAmount] = useState("");
  const [side, setSide] = useState<"YES" | "NO">("YES");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const busy = isSubmitting || isPending || isConfirming;

  const handleTrade = () => {
    if (!amount || Number(amount) <= 0) return;
    if (busy) return;

    setIsSubmitting(true);
    writeContract(
      {
        address: MARKET_ADDRESS,
        abi: PREDICTION_MARKET_ABI,
        functionName: "deposit",
        args: [BigInt(market.id), side === "YES" ? 0 : 1],
        value: parseEther(amount), // stake goes here, not as a function arg
      },
      {
        onSettled: () => setIsSubmitting(false),
      }
    );
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
        disabled={!isConnected || busy || !amount || Number(amount) <= 0}
        onClick={handleTrade}
      >
        {isPending ? "Confirm in wallet..." : isConfirming ? "Confirming..." : `Trade ${side}`}
      </Button>
    </div>
  );
}
