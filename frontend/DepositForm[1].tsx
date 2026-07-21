import { useState } from "react";
import { type Address, parseUnits } from "viem";
import { PREDICTION_MARKET_ADDRESS, predictionMarketAbi, erc20Abi, USDC_ADDRESS, Outcome } from "../lib/contract";
import { publicClient } from "../hooks/useWallet";

interface DepositFormProps {
  marketId: bigint;
  address: Address;
  walletClient: ReturnType<typeof import("viem").createWalletClient>;
  onDeposited: () => void;
}

type Step = "idle" | "approving" | "depositing" | "done" | "error";

export function DepositForm({ marketId, address, walletClient, onDeposited }: DepositFormProps) {
  const [side, setSide] = useState<"yes" | "no">("yes");
  const [amount, setAmount] = useState("");
  const [step, setStep] = useState<Step>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);

    const parsed = Number(amount);
    if (!parsed || parsed <= 0) {
      setErrorMsg("Enter an amount greater than 0.");
      return;
    }

    try {
      const amountUnits = parseUnits(amount, 6); // USDC = 6 decimals

      const allowance = await publicClient.readContract({
        address: USDC_ADDRESS,
        abi: erc20Abi,
        functionName: "allowance",
        args: [address, PREDICTION_MARKET_ADDRESS],
      });

      if (allowance < amountUnits) {
        setStep("approving");
        const approveHash = await walletClient.writeContract({
          account: address,
          address: USDC_ADDRESS,
          abi: erc20Abi,
          functionName: "approve",
          args: [PREDICTION_MARKET_ADDRESS, amountUnits],
          chain: undefined,
        });
        await publicClient.waitForTransactionReceipt({ hash: approveHash });
      }

      setStep("depositing");
      const depositHash = await walletClient.writeContract({
        account: address,
        address: PREDICTION_MARKET_ADDRESS,
        abi: predictionMarketAbi,
        functionName: "deposit",
        args: [marketId, side === "yes" ? Outcome.Yes : Outcome.No, amountUnits],
        chain: undefined,
      });
      await publicClient.waitForTransactionReceipt({ hash: depositHash });

      setStep("done");
      setAmount("");
      onDeposited();
      setTimeout(() => setStep("idle"), 2000);
    } catch (err) {
      setStep("error");
      setErrorMsg(err instanceof Error ? err.message : "Transaction failed.");
    }
  }

  const busy = step === "approving" || step === "depositing";

  return (
    <form className="deposit-form" onSubmit={handleSubmit}>
      <div className="deposit-form__side">
        <button
          type="button"
          className={`side-toggle side-toggle--yes ${side === "yes" ? "is-active" : ""}`}
          onClick={() => setSide("yes")}
        >
          YES
        </button>
        <button
          type="button"
          className={`side-toggle side-toggle--no ${side === "no" ? "is-active" : ""}`}
          onClick={() => setSide("no")}
        >
          NO
        </button>
      </div>

      <div className="deposit-form__amount">
        <span className="deposit-form__currency">USDC</span>
        <input
          type="number"
          inputMode="decimal"
          min="0"
          step="0.01"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={busy}
        />
      </div>

      <button type="submit" className="deposit-form__submit" disabled={busy}>
        {step === "approving" && "Approving USDC…"}
        {step === "depositing" && "Placing position…"}
        {step === "done" && "Confirmed ✓"}
        {(step === "idle" || step === "error") && "Place position"}
      </button>

      {errorMsg && <p className="deposit-form__error">{errorMsg}</p>}
    </form>
  );
}
