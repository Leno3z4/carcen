import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Formats large numbers with K/M abbreviations, e.g. 2410000 -> "2.41M" */
export function formatMetric(value: number | bigint): string {
  const n = typeof value === "bigint" ? Number(value) : value;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

/** Truncates a wallet address: 0x1234...abcd */
export function truncateAddress(address: string, chars = 4): string {
  if (!address) return "";
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/** Formats a USDC wei-like bigint (18 decimals, since USDC is Arc's native
 * gas token) into a human-readable string. */
export function formatUsdc(value: bigint, decimals = 2): string {
  const asNumber = Number(value) / 1e18;
  return asNumber.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/** Formats seconds remaining as "2h 14m" / "45s" etc. */
export function formatDuration(seconds: number): string {
  if (seconds <= 0) return "Closed";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}
