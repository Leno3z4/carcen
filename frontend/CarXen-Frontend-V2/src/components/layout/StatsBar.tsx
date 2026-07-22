import styles from "./StatsBar.module.css";

interface Stat {
  label: string;
  value: string;
}

const stats: Stat[] = [
  {
    label: "Active Markets",
    value: "12",
  },
  {
    label: "Total Volume",
    value: "$41.8K",
  },
  {
    label: "Open Interest",
    value: "$18.6K",
  },
  {
    label: "Resolution Rate",
    value: "100%",
  },
];

export default function StatsBar() {
  return (
    <section className={styles.stats}>
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={styles.card}
        >
          <span>{stat.label}</span>

          <strong>{stat.value}</strong>
        </div>
      ))}
    </section>
  );
}
