import { useEffect, useState } from "react";
import { useWallet } from "./hooks/useWallet";
import { useMarkets } from "./hooks/useMarkets";
import { MarketCard } from "./components/MarketCard";
import { publicClient } from "./hooks/useWallet";
import { PREDICTION_MARKET_ADDRESS, predictionMarketAbi } from "./lib/contract";

function shortenAddress(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export default function App() {
  const { address, connecting, error, wrongNetwork, connect, switchToArc, walletClient } = useWallet();
  const { markets, loading, error: marketsError, refresh } = useMarkets();
  const [feeBps, setFeeBps] = useState<number | null>(null);

  useEffect(() => {
    publicClient
      .readContract({ address: PREDICTION_MARKET_ADDRESS, abi: predictionMarketAbi, functionName: "feeBps" })
      .then((v) => setFeeBps(Number(v)))
      .catch(() => setFeeBps(null));
  }, []);

  return (
    <div className="app">
      <header className="app__header">
        <div className="app__brand">
          <span className="app__brand-mark">◐</span>
          <div>
            <div className="app__brand-name">CarXen</div>
            <div className="app__brand-sub">settled in USDC · testnet</div>
          </div>
        </div>

        <div className="app__wallet">
          {wrongNetwork && (
            <button className="app__network-warning" onClick={() => void switchToArc()}>
              Wrong network — switch to Arc Testnet
            </button>
          )}
          {address ? (
            <span className="app__address">{shortenAddress(address)}</span>
          ) : (
            <button className="app__connect" onClick={() => void connect()} disabled={connecting}>
              {connecting ? "Connecting…" : "Connect wallet"}
            </button>
          )}
        </div>
      </header>

      {error && <div className="app__banner app__banner--error">{error}</div>}

      <main className="app__main">
        {loading && <p className="app__loading">Loading markets…</p>}
        {marketsError && <p className="app__banner app__banner--error">{marketsError}</p>}
        {!loading && !marketsError && markets.length === 0 && (
          <p className="app__empty">No markets yet. The contract owner can create one with `createMarket`.</p>
        )}

        <div className="market-list">
          {markets.map((m) => (
            <MarketCard key={m.id.toString()} market={m} address={address} walletClient={walletClient} onChanged={refresh} />
          ))}
        </div>
      </main>

      <footer className="app__footer">
        Resolution is automated from live game data, checked against ESPN.{" "}
        {feeBps !== null && (
          <>A {(feeBps / 100).toFixed(1)}% fee applies to winnings only — your stake is always returned in full. </>
        )}
        Testnet USDC only — nothing here has real value yet.
      </footer>
    </div>
  );
}
