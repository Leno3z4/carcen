import { NavLink } from "react-router-dom";

import styles from "./Navbar.module.css";

export default function Navbar() {
  return (
    <header className={styles.navbar}>
      <div className={styles.container}>
        <NavLink to="/" className={styles.logo}>
          <div className={styles.logoMark}>◉</div>

          <div className={styles.logoText}>
            <span>CarXen</span>
            <small>Prediction Markets</small>
          </div>
        </NavLink>

        <nav className={styles.navigation}>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? `${styles.link} ${styles.active}`
                : styles.link
            }
          >
            Markets
          </NavLink>

          <NavLink
            to="/portfolio"
            className={({ isActive }) =>
              isActive
                ? `${styles.link} ${styles.active}`
                : styles.link
            }
          >
            Portfolio
          </NavLink>

          <NavLink
            to="/activity"
            className={({ isActive }) =>
              isActive
                ? `${styles.link} ${styles.active}`
                : styles.link
            }
          >
            Activity
          </NavLink>
        </nav>

        <div className={styles.actions}>
          <button className={styles.walletButton}>
            Connect Wallet
          </button>
        </div>
      </div>
    </header>
  );
}
