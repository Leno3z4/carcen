import Card from "../ui/Card";

type ProfileHeaderProps = {
  avatar: string;
  username: string;
  wallet: string;
  accuracy: string;
  marketsParticipated: number;
  totalWinnings: string;
};

export default function ProfileHeader({
  avatar,
  username,
  wallet,
  accuracy,
  marketsParticipated,
  totalWinnings,
}: ProfileHeaderProps) {
  return (
    <Card className="flex flex-col gap-6 md:flex-row md:items-center">
      <img
        src={avatar}
        alt={username}
        className="h-20 w-20 rounded-full object-cover"
      />

      <div className="flex-1">
        <h2 className="text-2xl font-semibold text-neutral-900">
          {username}
        </h2>

        <p className="mt-1 text-sm text-neutral-500">
          {wallet}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6 text-center">
        <div>
          <p className="text-sm text-neutral-500">Accuracy</p>
          <p className="mt-1 font-semibold">{accuracy}</p>
        </div>

        <div>
          <p className="text-sm text-neutral-500">
            Markets
          </p>
          <p className="mt-1 font-semibold">
            {marketsParticipated}
          </p>
        </div>

        <div>
          <p className="text-sm text-neutral-500">
            Total Winnings
          </p>
          <p className="mt-1 font-semibold">
            {totalWinnings}
          </p>
        </div>
      </div>
    </Card>
  );
}
