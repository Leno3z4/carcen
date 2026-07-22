import { FormEvent, useState } from "react";
import styles from "./DepositForm.module.css";

export type Position = "YES" | "NO";

interface DepositFormProps {
  disabled?: boolean;

  loading?: boolean;

  onDeposit(
    amount: number,
    side: Position
  ): Promise<void> | void;
}

export default function DepositForm({
  disabled = false,
  loading = false,
  onDeposit,
}: DepositFormProps) {
  const [amount, setAmount] = useState("");
  const [side, setSide] = useState<Position>("YES");

  function submit(e: FormEvent) {
    e.preventDefault();

    const parsed = Number(amount);

    if (!parsed || parsed <= 0) return;

    onDeposit(parsed, side);

    setAmount("");
  }

  return (
    <form
      className={styles.form}
      onSubmit={submit}
    >
      <div className={styles.sidePicker}>
        <button
          type="button"
          className={
            side === "YES"
              ? `${styles.side} ${styles.activeYes}`
              : styles.side
          }
          onClick={() => setSide("YES")}
        >
          YES
        </button>

        <button
          type="button"
          className={
            side === "NO"
              ? `${styles.side} ${styles.activeNo}`
              : styles.side
          }
          onClick={() => setSide("NO")}
        >
          NO
        </button>
      </div>

      <input
        type="number"
        min="0"
        step="0.01"
        placeholder="Amount (USDC)"
        value={amount}
        disabled={disabled || loading}
        onChange={(e) => setAmount(e.target.value)}
      />

      <button
        type="submit"
        disabled={disabled || loading}
      >
        {loading ? "Submitting..." : "Place Position"}
      </button>
    </form>
  );
}
