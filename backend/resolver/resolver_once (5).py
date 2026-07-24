"""
Single-pass version of the resolver, meant to be run on a schedule by GitHub
Actions rather than as an always-on server. On every run it:
  1. Fetches the current metric for every OPEN market and logs a snapshot
     (for the frontend growth chart) — regardless of whether it's closed yet.
  2. If a market has passed its deadline, resolves it + auto-pays winners
     using that same fetched value (no double-fetching, saves YouTube quota).
  3. Commits any new snapshot data back to the repo once, at the end.

This is genuinely free: GitHub Actions gives public repos unlimited scheduled
runs, no server or hosting needed at all.
"""

import sys
import time

from web3 import Web3

import metrics_client
import snapshot_store
from config import (
    ARC_RPC_URL, MARKET_ADDRESS, RESOLVER_PRIVATE_KEY, PREDICTION_MARKET_ABI,
    OUTCOME_UNRESOLVED, OUTCOME_YES,
)

_PLATFORM_NAMES = {0: "X", 1: "YOUTUBE", 2: "TIKTOK"}
_METRIC_NAMES = {0: "FOLLOWERS", 1: "VIEWS", 2: "SUBSCRIBERS"}


def get_contract(w3: Web3):
    return w3.eth.contract(address=Web3.to_checksum_address(MARKET_ADDRESS), abi=PREDICTION_MARKET_ABI)


def send_tx(w3: Web3, account, fn):
    tx = fn.build_transaction({
        "from": account.address,
        "nonce": w3.eth.get_transaction_count(account.address),
        "chainId": w3.eth.chain_id,
    })
    signed = w3.eth.account.sign_transaction(tx, RESOLVER_PRIVATE_KEY)
    raw_tx = getattr(signed, "raw_transaction", None) or getattr(signed, "rawTransaction", None)
    tx_hash = w3.eth.send_raw_transaction(raw_tx)
    return w3.eth.wait_for_transaction_receipt(tx_hash)


def find_winning_depositors(contract, market_id: int, winning_side: int) -> set[str]:
    events = contract.events.Deposited.get_logs(argument_filters={"marketId": market_id}, fromBlock=0)
    return {e["args"]["user"] for e in events if e["args"]["side"] == winning_side}


def process_market(w3: Web3, contract, account, market_id: int, now: int) -> None:
    (question, close_time, outcome, yes_pool, no_pool,
     platform, username, video_id, metric_type, target_value, _existing_measured) = contract.functions.getMarket(market_id).call()

    if outcome != OUTCOME_UNRESOLVED:
        return  # already resolved, nothing left to snapshot or resolve
    if not username:
        print(f"  [market {market_id}] no username set, skipping")
        return

    # Fetch once, use for both snapshot and (if applicable) resolution.
    try:
        platform_name = _PLATFORM_NAMES[platform]
        metric_name = _METRIC_NAMES[metric_type]
        measured_value = metrics_client.fetch_metric(platform_name, username, video_id, metric_name)
    except Exception as e:
        print(f"  [market {market_id}] {question} — fetch failed: {e}, will retry next run")
        return

    # Log the snapshot regardless of whether the market has closed yet — this is
    # what feeds the frontend's growth chart.
    snapshot_store.append_snapshot(market_id, measured_value, timestamp=now)
    print(f"  [market {market_id}] {question} — snapshot: {measured_value}")

    if now < close_time:
        return  # still open, snapshot logged, nothing else to do this run

    outcome_to_set = OUTCOME_YES if measured_value >= target_value else 2
    print(f"  [market {market_id}] {question} — CLOSED. measured {measured_value} vs target {target_value}. Resolving.")

    receipt = send_tx(w3, account, contract.functions.resolve(market_id, outcome_to_set, measured_value))
    print(f"    resolved in block {receipt.blockNumber}")

    winners = find_winning_depositors(contract, market_id, outcome_to_set)
    print(f"    paying {len(winners)} winner(s)...")
    for addr in winners:
        try:
            r = send_tx(w3, account, contract.functions.claimFor(market_id, addr))
            print(f"    paid {addr} (block {r.blockNumber})")
        except Exception as e:
            print(f"    could not auto-pay {addr}: {e}")


def main():
    if not MARKET_ADDRESS or not RESOLVER_PRIVATE_KEY:
        print("MARKET_ADDRESS or RESOLVER_PRIVATE_KEY not set — check GitHub Actions secrets.")
        sys.exit(1)

    w3 = Web3(Web3.HTTPProvider(ARC_RPC_URL))
    account = w3.eth.account.from_key(RESOLVER_PRIVATE_KEY)
    contract = get_contract(w3)

    next_id = contract.functions.nextMarketId().call()
    now = int(time.time())
    print(f"Resolver bot ({account.address}) checking {next_id} market(s)...")

    for market_id in range(next_id):
        try:
            process_market(w3, contract, account, market_id, now)
        except Exception as e:
            print(f"  [market {market_id}] error: {e}")

    snapshot_store.commit_and_push_snapshots()
    print("Done.")


if __name__ == "__main__":
    main()
