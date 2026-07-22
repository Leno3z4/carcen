"""
Single-pass version of the resolver, meant to be run on a schedule by GitHub
Actions rather than as an always-on server. Checks every open market once,
resolves + auto-pays anything that's finished, then exits.

This is genuinely free: GitHub Actions gives public repos unlimited scheduled
runs, no server or hosting needed at all.
"""

import sys
import time

from web3 import Web3

import espn_client
from config import (
    ARC_RPC_URL, MARKET_ADDRESS, RESOLVER_PRIVATE_KEY, PREDICTION_MARKET_ABI,
    OUTCOME_UNRESOLVED, OUTCOME_YES,
)


def get_contract(w3: Web3):
    return w3.eth.contract(address=Web3.to_checksum_address(MARKET_ADDRESS), abi=PREDICTION_MARKET_ABI)


def send_tx(w3: Web3, account, fn):
    tx = fn.build_transaction({
        "from": account.address,
        "nonce": w3.eth.get_transaction_count(account.address),
        "chainId": w3.eth.chain_id,
    })
    signed = w3.eth.account.sign_transaction(tx, RESOLVER_PRIVATE_KEY)
    # eth-account renamed this attribute across versions (rawTransaction -> raw_transaction).
    # Support both so this doesn't break depending on which version pip resolves.
    raw_tx = getattr(signed, "raw_transaction", None) or getattr(signed, "rawTransaction", None)
    tx_hash = w3.eth.send_raw_transaction(raw_tx)
    return w3.eth.wait_for_transaction_receipt(tx_hash)


def find_winning_depositors(contract, market_id: int, winning_side: int) -> set[str]:
    events = contract.events.Deposited.get_logs(argument_filters={"marketId": market_id}, fromBlock=0)
    return {e["args"]["user"] for e in events if e["args"]["side"] == winning_side}


def process_market(w3: Web3, contract, account, market_id: int) -> None:
    question, close_time, outcome, yes_pool, no_pool, league_path, event_id = contract.functions.getMarket(market_id).call()

    if outcome != OUTCOME_UNRESOLVED:
        print(f"  [market {market_id}] already resolved, skipping")
        return
    if int(time.time()) < close_time:
        print(f"  [market {market_id}] not closed yet, skipping")
        return
    if not league_path or not event_id:
        print(f"  [market {market_id}] no ESPN link set, skipping")
        return

    status = espn_client.get_game_status(league_path, event_id)
    if not status.completed:
        print(f"  [market {market_id}] {question} — state: {status.state}, not final yet")
        return

    if status.home_won is None:
        print(f"  [market {market_id}] {question} — TIE, needs manual resolution")
        return

    outcome_to_set = OUTCOME_YES if status.home_won else 2  # 2 = No
    print(f"  [market {market_id}] {question} — FINAL {status.away_team} {status.away_score} "
          f"@ {status.home_team} {status.home_score}. Resolving.")

    receipt = send_tx(w3, account, contract.functions.resolve(market_id, outcome_to_set))
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
    print(f"Resolver bot ({account.address}) checking {next_id} market(s)...")

    for market_id in range(next_id):
        try:
            process_market(w3, contract, account, market_id)
        except Exception as e:
            print(f"  [market {market_id}] error: {e}")

    print("Done.")


if __name__ == "__main__":
    main()
