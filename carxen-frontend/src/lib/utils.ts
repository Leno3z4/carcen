export function formatNumber(value: number): string {
  return new Intl.NumberFormat().format(value);
}

export function formatUSDC(value: number): string {
  return `${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} USDC`;
}

export function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
