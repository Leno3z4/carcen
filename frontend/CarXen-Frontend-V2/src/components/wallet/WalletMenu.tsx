import { Link } from "react-router-dom";
import styles from "./WalletDropdown.module.css";

interface WalletDropdownProps {
  address: string;
  onDisconnect: () => void;
}

export default function WalletDropdown({
  address,
  onDisconnect,
}: WalletDropdownProps) {
  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(address);
    } catch {
      console.error("Failed to copy address");
    }
  }

  return (
    <div className={styles.dropdown}>
      <div className={styles.header}>
        <div className={styles.avatar}>
          {address.slice(2, 4).toUpperCase()}
        </div>

        <div className={styles.walletInfo}>
          <span className={styles.connected}>
            Connected
          </span>

          <span className={styles.address}>
            {address}
          </span>
        </div>
      </div>

      <div className={styles.network}>
        <span className={styles.networkDot} />
        Arc Testnet
      </div>

      <div className={styles.divider} />

      <nav className={styles.menu}>
        <Link
          to="/portfolio"
          className={styles.link}
        >
          Portfolio
        </Link>

        <Link
          to="/activity"
          className={styles.link}
        >
          Activity
        </Link>

        <Link
          to="/profile"
          className={styles.link}
        >
          Profile
        </Link>

        <button
          className={styles.button}
          onClick={copyAddress}
        >
          Copy Address
        </button>
      </nav>

      <div className={styles.divider} />

      <button
        className={styles.disconnect}
        onClick={onDisconnect}
      >
        Disconnect Wallet
      </button>
    </div>
  );
}
