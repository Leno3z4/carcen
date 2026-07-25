import Navbar from "../../components/layout/Navbar";
import PageContainer from "../../components/layout/PageContainer";
import SearchBar from "../../components/navigation/SearchBar";
import FilterSelect from "../../components/ui/FilterSelect";
import MarketGrid from "../../components/market/MarketGrid";

const markets = [
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
    creator: "Kai Cenat",
    platform: "YouTube",
    question: "Will this stream reach 1,000,000 views within 6 hours?",
    current: 712000,
    target: 1000000,
    yes: 54,
    no: 46,
    volume: 8420,
    endTime: Date.now() + 1000 * 60 * 60,
  },
  {
    creator: "elonmusk",
    platform: "X",
    question: "Will this account gain 10,000 followers within 1 hour?",
    current: 221530000,
    target: 221540000,
    yes: 61,
    no: 39,
    volume: 5310,
    endTime: Date.now() + 1000 * 60 * 30,
  },
];

export default function HomePage() {
  return (
    <>
      <Navbar />

      <PageContainer>
        <div className="space-y-8">
          <div className="grid gap-4 lg:grid-cols-4">
            <div className="lg:col-span-2">
              <SearchBar />
            </div>

            <FilterSelect defaultValue="">
              <option value="">Platform</option>
              <option>YouTube</option>
              <option>X</option>
            </FilterSelect>

            <FilterSelect defaultValue="">
              <option value="">Metric</option>
              <option>Views</option>
              <option>Followers</option>
            </FilterSelect>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <FilterSelect defaultValue="1">
              <option value="1">1 Hour</option>
              <option value="3">3 Hours</option>
              <option value="6">6 Hours</option>
              <option value="10">10 Hours</option>
            </FilterSelect>
          </div>

          <MarketGrid markets={markets} />
        </div>
      </PageContainer>
    </>
  );
}
