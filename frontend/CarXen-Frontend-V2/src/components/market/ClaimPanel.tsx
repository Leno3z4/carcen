import styles from "./ClaimButton.module.css";

interface ClaimButtonProps {
  disabled?: boolean;

  loading?: boolean;

  canClaim: boolean;

  winnings?: string;

  onClaim(): Promise<void> | void;
}

export default function ClaimButton({
  disabled = false,
  loading = false,
  canClaim,
  winnings,
  onClaim,
}: ClaimButtonProps) {
  if (!canClaim) return null;

  return (
    <div className={styles.wrapper}>
      {winnings && (
        <div className={styles.amount}>
          Claimable
          <strong>{winnings} USDC</strong>
        </div>
      )}

      <button
        disabled={disabled || loading}
        className={styles.button}
        onClick={onClaim}
      >
        {loading ? "Claiming..." : "Claim Rewards"}
      </button>
    </div>
  );
}
