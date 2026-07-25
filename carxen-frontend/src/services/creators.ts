import type { Creator } from "../types/creator";

export async function getCreators(): Promise<Creator[]> {
  return [
    {
      id: "1",
      name: "MrBeast",
      platform: "YouTube",
      followers: 420000000,
      activeMarkets: 2,
      avatar: "https://placehold.co/120x120",
    },
    {
      id: "2",
      name: "Kai Cenat",
      platform: "YouTube",
      followers: 18500000,
      activeMarkets: 1,
      avatar: "https://placehold.co/120x120",
    },
    {
      id: "3",
      name: "elonmusk",
      platform: "X",
      followers: 221530000,
      activeMarkets: 3,
      avatar: "https://placehold.co/120x120",
    },
  ];
}
