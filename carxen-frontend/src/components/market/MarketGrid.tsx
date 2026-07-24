import MarketCard from "./MarketCard";

type Market = {
  creator: string;
  platform: string;
  question: string;
  current: number;
  target: number;
  yes: number;
  no: number;
  volume: number;
  endTime: number;
};

type MarketGridProps = {
  markets: Market[];
};

export default function MarketGrid({
  markets,
}: MarketGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {markets.map((market) => (
        <MarketCard
          key={`${market.creator}-${market.question}`}
          {...market}
        />
      ))}
    </div>
  );
}
