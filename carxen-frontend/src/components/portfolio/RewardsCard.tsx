import Card from "../ui/Card";
import Button from "../ui/Button";

type RewardsCardProps = {
  claimable: string;
  markets: number;
  onClaim?: () => void;
};

export default function RewardsCard({
  claimable,
  markets,
  onClaim,
}: RewardsCardProps) {
  return (
    <Card className="space-y-5">
      <div>
        <p className="text-sm text-neutral-500">
          Claimable Rewards
        </p>

        <h3 className="mt-2 text-3xl font-semibold text-neutral-900">
          {claimable}
        </h3>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-neutral-500">
          Resolved Markets
        </span>

        <span className="font-medium text-neutral-900">
          {markets}
        </span>
      </div>

      <Button
        className="w-full"
        onClick={onClaim}
      >
        Claim Rewards
      </Button>
    </Card>
  );
}
