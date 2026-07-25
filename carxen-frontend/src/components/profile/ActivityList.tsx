import Card from "../ui/Card";

type Activity = {
  id: string;
  title: string;
  timestamp: string;
};

type ActivityListProps = {
  activities: Activity[];
};

export default function ActivityList({
  activities,
}: ActivityListProps) {
  return (
    <Card className="space-y-5">
      <h2 className="text-xl font-semibold text-neutral-900">
        Recent Activity
      </h2>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-center justify-between border-b border-neutral-100 pb-4 last:border-0 last:pb-0"
          >
            <p className="text-sm text-neutral-900">
              {activity.title}
            </p>

            <span className="text-xs text-neutral-500">
              {activity.timestamp}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
