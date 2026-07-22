import styles from "./OddsBar.module.css";

interface OddsBarProps {
  yes: number;
  no: number;
}

export default function OddsBar({
  yes,
  no,
}: OddsBarProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.track}>
        <div
          className={styles.yes}
          style={{ width: `${yes}%` }}
        />

        <div
          className={styles.no}
          style={{ width: `${no}%` }}
        />
      </div>

      <div className={styles.labels}>
        <span className={styles.yesLabel}>
          YES {yes}%
        </span>

        <span className={styles.noLabel}>
          NO {no}%
        </span>
      </div>
    </div>
  );
}
