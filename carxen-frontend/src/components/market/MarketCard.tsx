import Card from "../ui/Card";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import ProbabilityBar from "./ProbabilityBar";
import ProgressIndicator from "./ProgressIndicator";
import Countdown from "./Countdown";

type MarketCardProps = {
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

export default function MarketCard({
  creator,
  platform,
  question,
  current,
  target,
  yes,
  no,
  volume,
  endTime,
}: MarketCardProps) {
  return (
    <Card className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-lg font-semibold text-neutral-900">
            {creator}
          </p>
          <p className="text-sm text-neutral-500">{platform}</p>
        </div>

        <Badge>Live</Badge>
      </div>

      <h3 className="text-base font-medium text-neutral-900">
        {question}
      </h3>

      <ProgressIndicator current={current} target={target} />

      <ProbabilityBar yes={yes} no={no} />

      <div className="flex items-center justify-between text-sm text-neutral-600">
        <span>{volume.toLocaleString()} ARC</span>
        <Countdown endTime={endTime} />
      </div>

      <Button className="w-full">
        Trade
      </Button>
    </Card>
  );
}
