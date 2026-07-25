import { useEffect, useState } from "react";

export default function useCountdown(endTime: number) {
  const [timeLeft, setTimeLeft] = useState(
    Math.max(0, endTime - Date.now())
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(Math.max(0, endTime - Date.now()));
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  return timeLeft;
}
