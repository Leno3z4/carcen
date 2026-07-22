import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <span className={styles.badge}>
          Built on Arc Testnet
        </span>

        <h1 className={styles.title}>
          Predict the outcome.
          <br />
          Earn from being right.
        </h1>

        <p className={styles.description}>
          CarXen is a prediction market where every position is backed by
          on-chain liquidity. Markets settle automatically using verified
          sports data and payouts happen directly on Arc.
        </p>

        <div className={styles.actions}>
          <button className={styles.primary}>
            Explore Markets
          </button>

          <button className={styles.secondary}>
            Learn More
          </button>
        </div>

        <div className={styles.metrics}>
          <div className={styles.metric}>
            <span>Settlement</span>
            <strong>Automatic</strong>
          </div>

          <div className={styles.metric}>
            <span>Asset</span>
            <strong>USDC</strong>
          </div>

          <div className={styles.metric}>
            <span>Network</span>
            <strong>Arc Testnet</strong>
          </div>
        </div>
      </div>

      <div className={styles.visual}>
        <div className={styles.orb}></div>

        <div className={styles.card}>
          <span className={styles.cardLabel}>
            Featured Market
          </span>

          <h3>
            Will Arsenal beat Chelsea?
          </h3>

          <div className={styles.odds}>
            <div>
              <small>YES</small>
              <strong>63%</strong>
            </div>

            <div>
              <small>NO</small>
              <strong>37%</strong>
            </div>
          </div>

          <div className={styles.progress}>
            <div
              className={styles.progressFill}
              style={{ width: "63%" }}
            />
          </div>

          <p className={styles.volume}>
            $24,380 Volume
          </p>
        </div>
      </div>
    </section>
  );
}
