export interface Wallet {
  address: string;
  balance: number;
  portfolioValue: number;
  todayPnL: number;
  totalPnL: number;
  claimableRewards: number;
}
