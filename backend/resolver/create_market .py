"""
List upcoming games for a league and create an on-chain market for one of them.

Usage:
    python create_market.py list football/nfl
    python create_market.py create football/nfl 401547439

The market question is auto-generated as "Will {home} beat {away}?" — so YES always
means "home team wins" by convention. Keep that convention everywhere (frontend,
resolver) or odds/labels will get confusing.
"""

import sys
from datetime import datetime, timezone

from web3 import Web3

import espn_client
from config import ARC_RPC_URL, MARKET_ADDRESS, OWNER_PRIVATE_KEY, PREDICTION_MARKET_ABI


def cmd_list(league_path: str):
    events = espn_client.list_upcoming_events(league_path)
    if not events:
        print(f"No games found for '{league_path}'. Check the league path is right.")
        return
    print(f"{'ID':<12} {'STATE':<6} {'START (UTC)':<20} MATCHUP")
    for e in events:
        start = datetime.fromisoformat(e["start_time"].replace("Z", "+00:00"))
        print(f"{e['id']:<12} {e['state']:<6} {start.strftime('%Y-%m-%d %H:%M'):<20} "
              f"{e['away_team']} @ {e['home_team']}")


def cmd_create(league_path: str, event_id: str):
    if not MARKET_ADDRESS:
        print("Set MARKET_ADDRESS in your .env first (the deployed contract address).")
        sys.exit(1)
    if not OWNER_PRIVATE_KEY:
        print("Set OWNER_PRIVATE_KEY in your .env first (the wallet that deployed the contract).")
        sys.exit(1)

    events = espn_client.list_upcoming_events(league_path)
    match = next((e for e in events if e["id"] == event_id), None)
    if not match:
        print(f"Event {event_id} not found in current '{league_path}' scoreboard.")
        print("Run `list` first to see valid IDs for today's/this week's games.")
        sys.exit(1)

    question = f"Will {match['home_team']} beat {match['away_team']}?"
    close_time = int(datetime.fromisoformat(match["start_time"].replace("Z", "+00:00")).timestamp())

    w3 = Web3(Web3.HTTPProvider(ARC_RPC_URL))
    account = w3.eth.account.from_key(OWNER_PRIVATE_KEY)
    contract = w3.eth.contract(address=Web3.to_checksum_address(MARKET_ADDRESS), abi=PREDICTION_MARKET_ABI)

    print(f"Creating market: \"{question}\"")
    print(f"Closes at kickoff: {match['start_time']}")
    print(f"YES = {match['home_team']} wins (home team, by convention)")

    tx = contract.functions.createMarket(question, close_time, league_path, event_id).build_transaction({
        "from": account.address,
        "nonce": w3.eth.get_transaction_count(account.address),
        "chainId": w3.eth.chain_id,
    })
    signed = w3.eth.account.sign_transaction(tx, OWNER_PRIVATE_KEY)
    tx_hash = w3.eth.send_raw_transaction(signed.raw_transaction)
    print(f"Submitted: {tx_hash.hex()}")

    receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
    print(f"Confirmed in block {receipt.blockNumber}. Refresh the frontend to see it.")


def main():
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(1)

    action = sys.argv[1]
    if action == "list":
        cmd_list(sys.argv[2])
    elif action == "create":
        if len(sys.argv) < 4:
            print("Usage: python create_market.py create <league_path> <event_id>")
            sys.exit(1)
        cmd_create(sys.argv[2], sys.argv[3])
    else:
        print(__doc__)
        sys.exit(1)


if __name__ == "__main__":
    main()
