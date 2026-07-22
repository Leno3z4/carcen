import styles from "./PredictionCard.module.css";

export interface PredictionCardProps {
  id: number;

  title: string;

  league: string;

  closesAt: string;

  volume: string;

  liquidity: string;

  yesProbability: number;

  noProbability: number;

  status: "OPEN" | "LIVE" | "RESOLVED";

  liveScore?: string;

  userPosition?: "YES" | "NO";

  onYes?(): void;

  onNo?(): void;
}

export default function PredictionCard({
  title,
  league,
  closesAt,
  volume,
  liquidity,
  yesProbability,
  noProbability,
  status,
  liveScore,
  userPosition,
  onYes,
  onNo,
}: PredictionCardProps) {
  return (
    <article className={styles.card}>
      <div className={styles.topRow}>
        <span className={styles.league}>
          {league}
        </span>

        <span
          className={`${styles.status} ${
            styles[status.toLowerCase()]
          }`}
        >
          {status}
        </span>
      </div>

      <h2 className={styles.title}>
        {title}
      </h2>

      {liveScore && (
        <div className={styles.score}>
          {liveScore}
        </div>
      )}

      <div className={styles.probability}>
        <div
          className={styles.yes}
          style={{ width: `${yesProbability}%` }}
        />

        <div
          className={styles.no}
          style={{ width: `${noProbability}%` }}
        />
      </div>

      <div className={styles.percentages}>
        <span>{yesProbability}% YES</span>

        <span>{noProbability}% NO</span>
      </div>

      <div className={styles.meta}>
        <div>
          <small>Volume</small>

          <strong>{volume}</strong>
        </div>

        <div>
          <small>Liquidity</small>

          <strong>{liquidity}</strong>
        </div>

        <div>
          <small>Closes</small>

          <strong>{closesAt}</strong>
        </div>
      </div>

      {userPosition && (
        <div className={styles.position}>
          Your Position:
          <strong>{userPosition}</strong>
        </div>
      )}

      <div className={styles.actions}>
        <button
          className={styles.buyYes}
          onClick={onYes}
        >
          Buy YES
        </button>

        <button
          className={styles.buyNo}
          onClick={onNo}
        >
          Buy NO
        </button>
      </div>
    </article>
  );
}
