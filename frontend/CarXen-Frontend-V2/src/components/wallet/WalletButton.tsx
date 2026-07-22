import { useState, useRef, useEffect } from "react";
import WalletDropdown from "./WalletDropdown";
import styles from "./WalletButton.module.css";

interface WalletButtonProps {
  address?: string;

  connecting?: boolean;

  onConnect(): void;

  onDisconnect(): void;
}

function shorten(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export default function WalletButton({
  address,
  connecting,
  onConnect,
  onDisconnect,
}: WalletButtonProps) {
  const [open, setOpen] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function clickOutside(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    window.addEventListener("mousedown", clickOutside);

    return () =>
      window.removeEventListener(
        "mousedown",
        clickOutside
      );
  }, []);

  if (!address) {
    return (
      <button
        className={styles.connect}
        disabled={connecting}
        onClick={onConnect}
      >
        {connecting
          ? "Connecting..."
          : "Connect Wallet"}
      </button>
    );
  }

  return (
    <div
      className={styles.wrapper}
      ref={ref}
    >
      <button
        className={styles.wallet}
        onClick={() => setOpen(!open)}
      >
        <span className={styles.dot} />

        {shorten(address)}

        <span className={styles.arrow}>
          ▼
        </span>
      </button>

      {open && (
        <WalletDropdown
          address={address}
          onDisconnect={() => {
            onDisconnect();
            setOpen(false);
          }}
        />
      )}
    </div>
  );
}
