import { useEffect, useState } from "react";
import { type Address, formatUnits } from "viem";
import type { MarketData } from "../hooks/useMarkets";
import { fetchUserPosition } from "../hooks/useMarkets";
import { OddsBar } from "./OddsBar";
import { DepositForm } from "./DepositForm";
import { LiveScore } from "./LiveScore";
import { PREDICTION_MARKET_ADDRESS, predictionMarketAbi } from "../lib/contract";
import { publicClient } from "../hooks/useWallet";

interface MarketCardProps {
  market: MarketData;
  address: Address | null;
  walletClient: ReturnType<typeof import("viem").createWalletClient> | null;
  onChanged: () => void;
}

function formatUsdc(units: bigint) {
  return Number(formatUnits(units, 6)).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function statusLabel(market: MarketData) {
  const now = Date.now() / 1000;
  if (market.outcome === 1) return { text: "RESOLVED · YES", tone: "yes" as const };
  if (market.outcome === 2) return { text: "RESOLVED · NO", tone: "no" as const };
  if (Number(market.closeTime) < now) return { text: "CLOSED · AWAITING RESOLUTION", tone: "pending" as const };
  return { text: "OPEN", tone: "open" as const };
}

export function MarketCard({ market, address, walletClient, onChanged }: MarketCardProps) {
  const [position, setPosition] = useState<{ yesAmount: bigint; noAmount: bigint; hasClaimed: boolean } | null>(
    null
  );
  const [claiming, setClaiming] = useState(false);
  const [claimError, setClaimError] = useState<string | null>(null);

  useEffect(() => {
    if (!address) {
      setPosition(null);
      return;
    }
    fetchUserPosition(market.id, address).then(setPosition).catch(() => setPosition(null));
  }, [market.id, address, market.outcome]);

  const status = statusLabel(market);
  const totalPool = market.yesPool + market.noPool;

  const canClaim =
    position &&
    !position.hasClaimed &&
    ((market.outcome === 1 && position.yesAmount > 0n) || (market.outcome === 2 && position.noAmount > 0n));

  async function handleClaim() {
    if (!walletClient || !address) return;
    setClaiming(true);
    setClaimError(null);
    try {
      const hash = await walletClient.writeContract({
        account: address,
        address: PREDICTION_MARKET_ADDRESS,
        abi: predictionMarketAbi,
        functionName: "claim",
        args: [market.id],
        chain: undefined,
      });
      await publicClient.waitForTransactionReceipt({ hash });
      onChanged();
    } catch (err) {
      setClaimError(err instanceof Error ? err.message : "Claim failed.");
    } finally {
      setClaiming(false);
    }
  }

  return (
    <article className="market-card">
      <header className="market-card__header">
        <span className={`market-card__status market-card__status--${status.tone}`}>{status.text}</span>
        <span className="market-card__id">#{market.id.toString().padStart(3, "0")}</span>
      </header>

      <h2 className="market-card__question">{market.question}</h2>

      <LiveScore leaguePath={market.espnLeaguePath} eventId={market.espnEventId} />

      <OddsBar yesBps={market.impliedYesBps} />

      <div className="market-card__meta">
        <span>{formatUsdc(totalPool)} USDC pooled</span>
        <span>closes {new Date(Number(market.closeTime) * 1000).toLocaleDateString()}</span>
      </div>

      {position && (position.yesAmount > 0n || position.noAmount > 0n) && (
        <div className="market-card__position">
          Your position:
          {position.yesAmount > 0n && <span className="pos pos--yes"> {formatUsdc(position.yesAmount)} YES</span>}
          {position.noAmount > 0n && <span className="pos pos--no"> {formatUsdc(position.noAmount)} NO</span>}
          {position.hasClaimed && <span className="pos pos--claimed"> · claimed</span>}
        </div>
      )}

      {!address && <p className="market-card__hint">Connect a wallet to place a position.</p>}

      {address && walletClient && market.outcome === 0 && Number(market.closeTime) > Date.now() / 1000 && (
        <DepositForm
          marketId={market.id}
          address={address}
          walletClient={walletClient}
          onDeposited={onChanged}
        />
      )}

      {address && walletClient && canClaim && (
        <button className="claim-button" onClick={handleClaim} disabled={claiming}>
          {claiming ? "Claiming…" : "Claim winnings"}
        </button>
      )}

      {claimError && <p className="deposit-form__error">{claimError}</p>}
    </article>
  );
}
