export type MarketSnapshot = {
  timestamp: number;
  value: number;
};

export async function getMarketSnapshots(
  marketId: string
): Promise<MarketSnapshot[]> {
  return [
    {
      timestamp: Date.now() - 1000 * 60 * 20,
      value: 2410000,
    },
    {
      timestamp: Date.now() - 1000 * 60 * 15,
      value: 2448000,
    },
    {
      timestamp: Date.now() - 1000 * 60 * 10,
      value: 2495000,
    },
    {
      timestamp: Date.now() - 1000 * 60 * 5,
      value: 2531000,
    },
    {
      timestamp: Date.now(),
      value: 2567000,
    },
  ];
}
