import Card from "../ui/Card";
import Button from "../ui/Button";

type WalletOverviewProps = {
  address: string;
  balance: string;
  portfolioValue: string;
  todayPnL: string;
  totalPnL: string;
};

export default function WalletOverview({
  address,
  balance,
  portfolioValue,
  todayPnL,
  totalPnL,
}: WalletOverviewProps) {
  return (
    <Card className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-neutral-900">
          Wallet Overview
        </h2>

        <p className="mt-1 text-sm text-neutral-500">
          {address}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-sm text-neutral-500">ARC Balance</p>
          <p className="mt-1 text-lg font-semibold">{balance}</p>
        </div>

        <div>
          <p className="text-sm text-neutral-500">Portfolio Value</p>
          <p className="mt-1 text-lg font-semibold">{portfolioValue}</p>
        </div>

        <div>
          <p className="text-sm text-neutral-500">Today's P/L</p>
          <p className="mt-1 text-lg font-semibold">{todayPnL}</p>
        </div>

        <div>
          <p className="text-sm text-neutral-500">Total P/L</p>
          <p className="mt-1 text-lg font-semibold">{totalPnL}</p>
        </div>
      </div>

      <div className="flex gap-3">
        <Button>Claim Rewards</Button>
        <Button className="bg-neutral-200 text-neutral-900 hover:bg-neutral-300">
          Copy Address
        </Button>
      </div>
    </Card>
  );
}
