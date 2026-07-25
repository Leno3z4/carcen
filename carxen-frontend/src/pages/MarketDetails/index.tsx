import Navbar from "../../components/layout/Navbar";
import PageContainer from "../../components/layout/PageContainer";
import GrowthChart from "../../components/charts/GrowthChart";
import TradePanel from "../../components/market/TradePanel";
import Card from "../../components/ui/Card";

const history = [
  { t: 1721770000, v: 2410000 },
  { t: 1721770900, v: 2458000 },
  { t: 1721771800, v: 2513000 },
  { t: 1721772700, v: 2591000 },
  { t: 1721773600, v: 2669000 },
];

export default function MarketDetailsPage() {
  return (
    <>
      <Navbar />

      <PageContainer>
        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <Card>
              <div className="space-y-3">
                <p className="text-sm text-neutral-500">
                  YouTube · MrBeast
                </p>

                <h1 className="text-3xl font-semibold text-neutral-900">
                  Will this video reach 3,000,000 views within 3 hours?
                </h1>

                <div className="flex flex-wrap gap-6 text-sm text-neutral-600">
                  <span>Current: 2,410,000</span>
                  <span>Target: 3,000,000</span>
                  <span>Remaining: 02:14:38</span>
                </div>
              </div>
            </Card>

            <GrowthChart data={history} />

            <Card>
              <div className="grid gap-6 md:grid-cols-3">
                <div>
                  <p className="text-sm text-neutral-500">
                    Participants
                  </p>

                  <p className="mt-1 text-2xl font-semibold">
                    1,284
                  </p>
                </div>

                <div>
                  <p className="text-sm text-neutral-500">
                    Volume
                  </p>

                  <p className="mt-1 text-2xl font-semibold">
                    12,430 ARC
                  </p>
                </div>

                <div>
                  <p className="text-sm text-neutral-500">
                    Probability
                  </p>

                  <p className="mt-1 text-2xl font-semibold">
                    YES 68%
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <TradePanel />
        </div>
      </PageContainer>
    </>
  );
}
