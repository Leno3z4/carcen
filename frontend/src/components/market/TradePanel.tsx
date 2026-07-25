import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { parseEther } from "viem";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { WalletStateBanner, type TxState } from "@/components/wallet/WalletStates";
import { PREDICTION_MARKET_ABI } from "@/lib/abi";
import { MARKET_ADDRESS } from "@/lib/contract";
import { Outcome, type Market } from "@/types/market";
import { formatUsdc } from "@/lib/utils";

const stakeSchema = z.object({
  amount: z.coerce.number().positive("Enter an amount greater than 0"),
});
type StakeForm = z.infer<typeof stakeSchema>;

export default function TradePanel({ market }: { market: Market }) {
  const { isConnected } = useAccount();
  const [side, setSide] = useState<Outcome.YES | Outcome.NO>(Outcome.YES);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<StakeForm>({ resolver: zodResolver(stakeSchema) });

  const amount = watch("amount") || 0;

  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const txState: TxState = error ? "failed" : isConfirming ? "pending" : isSuccess ? "confirmed" : "idle";

  // Estimated payout if this side wins: stake back + proportional share of
  // the losing pool. Pari-mutuel pool, not a share/order-book system.
  const yesPool = Number(market.yesPool) / 1e18;
  const noPool = Number(market.noPool) / 1e18;
  const winningPool = side === Outcome.YES ? yesPool : noPool;
  const losingPool = side === Outcome.YES ? noPool : yesPool;
  const projectedWinningPool = winningPool + amount;
  const estimatedPayout =
    projectedWinningPool > 0 ? amount + (amount * losingPool) / projectedWinningPool : amount;

  const closed = Number(market.closeTime) * 1000 < Date.now();

  const onSubmit = (data: StakeForm) => {
    writeContract({
      address: MARKET_ADDRESS,
      abi: PREDICTION_MARKET_ABI,
      functionName: "deposit",
      args: [BigInt(market.id), side],
      value: parseEther(String(data.amount)),
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant={side === Outcome.YES ? "primary" : "secondary"}
          onClick={() => setSide(Outcome.YES)}
          className={side === Outcome.YES ? "!bg-emerald-500 hover:!bg-emerald-600" : ""}
        >
          Buy YES
        </Button>
        <Button
          variant={side === Outcome.NO ? "primary" : "secondary"}
          onClick={() => setSide(Outcome.NO)}
          className={side === Outcome.NO ? "!bg-red-500 hover:!bg-red-600" : ""}
        >
          Buy NO
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <label className="text-xs text-text-secondary mb-1 block">Stake (USDC)</label>
          <Input type="number" step="any" placeholder="0.00" {...register("amount")} />
          {errors.amount && <p className="text-xs text-red-500 mt-1">{errors.amount.message}</p>}
        </div>

        <div className="rounded-control bg-black/5 p-3 text-sm space-y-1">
          <div className="flex justify-between text-text-secondary">
            <span>If {side === Outcome.YES ? "YES" : "NO"} wins, you receive</span>
            <span className="font-medium text-text-primary">
              {estimatedPayout.toFixed(2)} USDC
            </span>
          </div>
          <p className="text-xs text-text-secondary">
            Your stake back plus a proportional share of the losing pool.
          </p>
        </div>

        <WalletStateBanner txState={txState} txError={error?.message} />

        <Button
          type="submit"
          className="w-full"
          disabled={!isConnected || closed || isPending || isConfirming}
        >
          {closed
            ? "Market Closed"
            : isPending || isConfirming
            ? "Confirming..."
            : "Confirm Trade"}
        </Button>
      </form>
    </div>
  );
}
