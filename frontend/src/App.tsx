import { useEffect, useState } from "react";
import { useWallet } from "./hooks/useWallet";
import { useMarkets } from "./hooks/useMarkets";
import { MarketCard } from "./components/MarketCard";
import { publicClient } from "./hooks/useWallet";
import {
  PREDICTION_MARKET_ADDRESS,
  predictionMarketAbi,
} from "./lib/contract";

function shortenAddress(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export default function App() {
  const {
    address,
    connecting,
    error,
    wrongNetwork,
    connect,
    switchToArc,
    walletClient,
  } = useWallet();

  const {
    markets,
    loading,
    error: marketsError,
    refresh,
  } = useMarkets();

  const [feeBps, setFeeBps] = useState<number | null>(null);

  useEffect(() => {
    publicClient
      .readContract({
        address: PREDICTION_MARKET_ADDRESS,
        abi: predictionMarketAbi,
        functionName: "feeBps",
      })
      .then((v) => setFeeBps(Number(v)))
      .catch(() => setFeeBps(null));
  }, []);

  const liveMarkets = markets.filter(
    (m) => Number(m.outcome) === 0
  ).length;

  return (
    <div className="app">

      <header className="app__header">

        <div className="app__brand">
          <div className="app__brand-mark">◈</div>

          <div>
            <div className="app__brand-name">CarXen</div>
            <div className="app__brand-sub">
              Sports prediction markets on Arc
            </div>
          </div>
        </div>

        <div className="app__wallet">

          {wrongNetwork && (
            <button
              className="app__network-warning"
              onClick={() => void switchToArc()}
            >
              Switch to Arc Testnet
            </button>
          )}

          {address ? (
            <button className="app__address">
              <span className="wallet-dot"></span>
              {shortenAddress(address)}
            </button>
          ) : (
            <button
              className="app__connect"
              onClick={() => void connect()}
              disabled={connecting}
            >
              {connecting ? "Connecting..." : "Connect Wallet"}
            </button>
          )}

        </div>

      </header>

      <section className="hero">

        <div className="hero__content">

          <p className="hero__eyebrow">
            BUILT FOR ARC
          </p>

          <h1 className="hero__title">
            Trade sports outcomes
            <br />
            with confidence.
          </h1>

          <p className="hero__description">
            CarXen lets you trade prediction markets using
            testnet USDC with transparent odds and automated
            settlement powered by live game results.
          </p>

          <div className="hero__actions">

            <button className="hero__button">
              Explore Markets
            </button>

          </div>

        </div>

      </section>

      <section className="overview">

        <div className="overview__card">
          <span>Total Markets</span>
          <strong>{markets.length}</strong>
        </div>

        <div className="overview__card">
          <span>Live Markets</span>
          <strong>{liveMarkets}</strong>
        </div>

        <div className="overview__card">
          <span>Settlement</span>
          <strong>ESPN</strong>
        </div>

        <div className="overview__card">
          <span>Network</span>
          <strong>Arc</strong>
        </div>

      </section>

      {error && (
        <div className="app__banner app__banner--error">
          {error}
        </div>
      )}

      <main className="app__main">

        <div className="section-title">

          <div>

            <h2>Featured Markets</h2>

            <p>
              Live sports markets settled automatically.
            </p>

          </div>

        </div>

        {loading && (
          <p className="app__loading">
            Loading markets...
          </p>
        )}

        {marketsError && (
          <p className="app__banner app__banner--error">
            {marketsError}
          </p>
        )}

        {!loading &&
          !marketsError &&
          markets.length === 0 && (
            <p className="app__empty">
              No active markets yet.
            </p>
          )}

        <div className="market-list">
          {markets.map((m) => (
            <MarketCard
              key={m.id.toString()}
              market={m}
              address={address}
              walletClient={walletClient}
              onChanged={refresh}
            />
          ))}
        </div>

      </main>

      <footer className="app__footer">

        <div className="footer-top">

          <div>

            <strong>CarXen</strong>

            <p>
              Prediction markets built for Arc.
            </p>

          </div>

          <div>

            <strong>Settlement</strong>

            <p>
              Live ESPN game data.
            </p>

          </div>

        </div>

        <div className="footer-bottom">

          {feeBps !== null && (
            <span>
              {(feeBps / 100).toFixed(1)}% protocol fee on winnings.
            </span>
          )}

          <span>
            Testnet USDC only.
          </span>

        </div>

      </footer>

    </div>
  );
}
