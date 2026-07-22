import styles from "./WalletDropdown.module.css";

interface WalletDropdownProps {
  address: string;

  onDisconnect(): void;
}

function copy(address: string) {
  navigator.clipboard.writeText(address);
}

export default function WalletDropdown({
  address,
  onDisconnect,
}: WalletDropdownProps) {
  return (
    <div className={styles.dropdown}>
      <div className={styles.addressBox}>
        <span className={styles.label}>
          Connected Wallet
        </span>

        <span className={styles.address}>
          {address}
        </span>
      </div>

      <div className={styles.divider} />

      <button className={styles.item}>
        Portfolio
      </button>

      <button className={styles.item}>
        Activity
      </button>

      <button className={styles.item}>
        Profile
      </button>

      <button
        className={styles.item}
        onClick={() => copy(address)}
      >
        Copy Address
      </button>

      <div className={styles.divider} />

      <button
        className={`${styles.item} ${styles.disconnect}`}
        onClick={onDisconnect}
      >
        Disconnect
      </button>
    </div>
  );
}
