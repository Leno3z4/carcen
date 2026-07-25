import type { Market } from "../types/market";

export async function getMarkets(): Promise<Market[]> {
  return [
    {
      id: "1",
      creator: "MrBeast",
      platform: "YouTube",
      question: "Will this video reach 3,000,000 views within 3 hours?",
      current: 2410000,
      target: 3000000,
      yes: 68,
      no: 32,
      volume: 12430,
      endTime: Date.now() + 1000 * 60 * 60 * 2,
    },
  ];
}
