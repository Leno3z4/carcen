import { useEffect, useState } from "react";
import { formatDuration } from "@/lib/utils";

export default function CountdownTimer({ closeTime }: { closeTime: bigint }) {
  const [now, setNow] = useState(() => Math.floor(Date.now() / 1000));

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const remaining = Number(closeTime) - now;

  return (
    <span className={remaining <= 0 ? "text-text-secondary" : "text-text-primary"}>
      {formatDuration(remaining)}
    </span>
  );
}
