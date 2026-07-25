import Navbar from "../../components/layout/Navbar";
import PageContainer from "../../components/layout/PageContainer";
import WalletOverview from "../../components/portfolio/WalletOverview";
import PositionCard from "../../components/portfolio/PositionCard";
import RewardsCard from "../../components/portfolio/RewardsCard";

export default function PortfolioPage() {
  return (
    <>
      <Navbar />

      <PageContainer>
        <div className="space-y-8">
          <WalletOverview
            address="0x8A91...4dF2"
            balance="2,315 USDC"
            portfolioValue="5,482 USDC"
            todayPnL="+142 USDC"
            totalPnL="+931 USDC"
          />

          <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
            <div className="space-y-6">
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">
                  Open Positions
                </h2>

                <PositionCard
                  prediction="Will this video reach 3,000,000 views within 3 hours?"
                  side="YES"
                  amount="250 USDC"
                  currentValue="341 USDC"
                  profitLoss="+91 USDC"
                  remainingTime="01:24:51"
                />

                <PositionCard
                  prediction="Will this account gain 10,000 followers within 1 hour?"
                  side="NO"
                  amount="180 USDC"
                  currentValue="167 USDC"
                  profitLoss="-13 USDC"
                  remainingTime="00:42:18"
                />
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">
                  Resolved Markets
                </h2>

                <PositionCard
                  prediction="Will this stream reach 1,000,000 views within 6 hours?"
                  side="YES"
                  amount="120 USDC"
                  currentValue="224 USDC"
                  profitLoss="+104 USDC"
                  remainingTime="Resolved"
                />
              </section>
            </div>

            <RewardsCard
              claimable="412 USDC"
              markets={6}
            />
          </div>
        </div>
      </PageContainer>
    </>
  );
}
