import { useParams } from "react-router-dom";
import { useMarkets } from "@/hooks/useMarkets";
import TradePanel from "@/components/market/TradePanel";
import CountdownTimer from "@/components/market/CountdownTimer";

export default function MarketDetail() {
  const { id } = useParams();

  const { markets } = useMarkets();

  const market = markets.find(
    (m) => String(m.id) === id
  );

  if (!market) {
    return (
      <div className="rounded-3xl border border-blue-100 bg-white p-12 text-center">
        <h2 className="text-2xl font-semibold">
          Market not found
        </h2>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">

      <div className="rounded-[32px] border border-blue-100 bg-white p-8 shadow-[0_20px_60px_rgba(59,130,246,.08)]">

        <span className="rounded-full bg-blue-100 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-blue-700">
          Live Market
        </span>

        <h1 className="mt-6 text-4xl font-bold text-slate-900">
          {market.question}
        </h1>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">

          <div className="rounded-2xl bg-blue-50 p-5">
            <p className="text-xs uppercase text-slate-500">
              Creator
            </p>

            <p className="mt-2 text-xl font-semibold">
              {market.username}
            </p>
          </div>

          <div className="rounded-2xl bg-blue-50 p-5">
            <p className="text-xs uppercase text-slate-500">
              Ends In
            </p>

            <div className="mt-2 text-xl font-semibold">
              <CountdownTimer closeTime={market.closeTime} />
            </div>
          </div>

          <div className="rounded-2xl bg-blue-50 p-5">
            <p className="text-xs uppercase text-slate-500">
              YES Pool
            </p>

            <p className="mt-2 text-xl font-bold">
              {Number(market.yesPool) / 1e6} USDC
            </p>
          </div>

          <div className="rounded-2xl bg-blue-50 p-5">
            <p className="text-xs uppercase text-slate-500">
              NO Pool
            </p>

            <p className="mt-2 text-xl font-bold">
              {Number(market.noPool) / 1e6} USDC
            </p>
          </div>

        </div>

      </div>

      <TradePanel market={market} />

    </div>
  );
}
