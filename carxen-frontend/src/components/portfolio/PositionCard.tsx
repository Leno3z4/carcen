import Card from "../ui/Card";

type PositionCardProps = {
  prediction: string;
  side: "YES" | "NO";
  amount: string;
  currentValue: string;
  profitLoss: string;
  remainingTime: string;
};

export default function PositionCard({
  prediction,
  side,
  amount,
  currentValue,
  profitLoss,
  remainingTime,
}: PositionCardProps) {
  return (
    <Card className="space-y-4">
      <h3 className="text-base font-semibold text-neutral-900">
        {prediction}
      </h3>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-neutral-500">Side</p>
          <p className="font-medium">{side}</p>
        </div>

        <div>
          <p className="text-neutral-500">Amount</p>
          <p className="font-medium">{amount}</p>
        </div>

        <div>
          <p className="text-neutral-500">Current Value</p>
          <p className="font-medium">{currentValue}</p>
        </div>

        <div>
          <p className="text-neutral-500">Profit / Loss</p>
          <p className="font-medium">{profitLoss}</p>
        </div>
      </div>

      <p className="text-sm text-neutral-500">
        Remaining: {remainingTime}
      </p>
    </Card>
  );
}
