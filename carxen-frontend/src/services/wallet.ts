import type { Wallet } from "../types/wallet";

export async function getWallet(): Promise<Wallet> {
  return {
    address: "0x8A91...4dF2",
    balance: 2315.42,
    portfolioValue: 5482.15,
    todayPnL: 142.61,
    totalPnL: 931.83,
    claimableRewards: 412.5,
  };
}
