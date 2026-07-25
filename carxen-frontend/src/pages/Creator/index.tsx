import Navbar from "../../components/layout/Navbar";
import PageContainer from "../../components/layout/PageContainer";
import Card from "../../components/ui/Card";
import MarketGrid from "../../components/market/MarketGrid";

const creatorMarkets = [
  {
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
  {
    creator: "MrBeast",
    platform: "YouTube",
    question: "Will this Short reach 5,000,000 views within 24 hours?",
    current: 3915000,
    target: 5000000,
    yes: 73,
    no: 27,
    volume: 9450,
    endTime: Date.now() + 1000 * 60 * 60 * 8,
  },
];

export default function CreatorPage() {
  return (
    <>
      <Navbar />

      <PageContainer>
        <div className="space-y-8">
          <Card>
            <div className="flex items-center gap-5">
              <img
                src="https://placehold.co/120x120"
                alt="MrBeast"
                className="h-24 w-24 rounded-full object-cover"
              />

              <div>
                <h1 className="text-3xl font-semibold text-neutral-900">
                  MrBeast
                </h1>

                <p className="mt-1 text-neutral-500">
                  YouTube Creator
                </p>

                <div className="mt-4 flex gap-6 text-sm text-neutral-600">
                  <span>420M Subscribers</span>
                  <span>2 Active Markets</span>
                </div>
              </div>
            </div>
          </Card>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">
              Active Prediction Markets
            </h2>

            <MarketGrid markets={creatorMarkets} />
          </section>
        </div>
      </PageContainer>
    </>
  );
}
