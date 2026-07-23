"""
Check a creator's current metric value, then create an on-chain market betting
on whether it'll hit a target by a deadline.

Usage:
    python create_market.py check youtube MrBeast subscribers
    python create_market.py check x elonmusk followers
    python create_market.py create youtube MrBeast subscribers 300000000 "2026-12-31T23:59:59"
    python create_market.py create youtube MrBeast views 50000000 "2026-08-15T00:00:00" dQw4w9WgXcQ

The market question is auto-generated as "Will {username}'s {platform} {metric}
reach {target}?" — so YES always means "measured value >= target" by convention.
Keep that convention everywhere (frontend, resolver) or odds/labels get confusing.
"""

import sys
from datetime import datetime, timezone

from web3 import Web3

import metrics_client
from config import (
    ARC_RPC_URL, MARKET_ADDRESS, OWNER_PRIVATE_KEY, PREDICTION_MARKET_ABI,
    PLATFORM_X, PLATFORM_YOUTUBE, PLATFORM_TIKTOK,
    METRIC_FOLLOWERS, METRIC_VIEWS, METRIC_SUBSCRIBERS,
)

PLATFORM_CODES = {"x": PLATFORM_X, "youtube": PLATFORM_YOUTUBE, "tiktok": PLATFORM_TIKTOK}
METRIC_CODES = {"followers": METRIC_FOLLOWERS, "views": METRIC_VIEWS, "subscribers": METRIC_SUBSCRIBERS}


def cmd_check(platform: str, username: str, metric_type: str, video_id: str = ""):
    platform_upper = platform.upper()
    metric_upper = metric_type.upper()
    try:
        current = metrics_client.fetch_metric(platform_upper, username, video_id, metric_upper)
    except Exception as e:
        print(f"Fetch failed: {e}")
        sys.exit(1)
    print(f"{username} on {platform} — current {metric_type}: {current:,}")


def cmd_create(platform: str, username: str, metric_type: str, target_value: str, deadline: str, video_id: str = ""):
    if not MARKET_ADDRESS:
        print("Set MARKET_ADDRESS in your .env first (the deployed contract address).")
        sys.exit(1)
    if not OWNER_PRIVATE_KEY:
        print("Set OWNER_PRIVATE_KEY in your .env first (the wallet that deployed the contract).")
        sys.exit(1)

    platform_key = platform.lower()
    metric_key = metric_type.lower()
    if platform_key not in PLATFORM_CODES:
        print(f"Unknown platform '{platform}'. Use one of: {', '.join(PLATFORM_CODES)}")
        sys.exit(1)
    if metric_key not in METRIC_CODES:
        print(f"Unknown metric '{metric_type}'. Use one of: {', '.join(METRIC_CODES)}")
        sys.exit(1)

    platform_code = PLATFORM_CODES[platform_key]
    metric_code = METRIC_CODES[metric_key]
    target_int = int(target_value)
    close_time = int(datetime.fromisoformat(deadline).replace(tzinfo=timezone.utc).timestamp())

    question = f"Will {username}'s {platform} {metric_type} reach {target_int:,}?"

    w3 = Web3(Web3.HTTPProvider(ARC_RPC_URL))
    account = w3.eth.account.from_key(OWNER_PRIVATE_KEY)
    contract = w3.eth.contract(address=Web3.to_checksum_address(MARKET_ADDRESS), abi=PREDICTION_MARKET_ABI)

    print(f"Creating market: \"{question}\"")
    print(f"Closes: {deadline} UTC")
    print(f"YES = measured value >= {target_int:,} at close")

    tx = contract.functions.createMarket(
        question, close_time, platform_code, username, video_id, metric_code, target_int
    ).build_transaction({
        "from": account.address,
        "nonce": w3.eth.get_transaction_count(account.address),
        "chainId": w3.eth.chain_id,
    })
    signed = w3.eth.account.sign_transaction(tx, OWNER_PRIVATE_KEY)
    raw_tx = getattr(signed, "raw_transaction", None) or getattr(signed, "rawTransaction", None)
    tx_hash = w3.eth.send_raw_transaction(raw_tx)
    print(f"Submitted: {tx_hash.hex()}")

    receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
    print(f"Confirmed in block {receipt.blockNumber}. Refresh the frontend to see it.")


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    action = sys.argv[1]
    if action == "check":
        # check <platform> <username> <metric_type> [video_id]
        if len(sys.argv) < 5:
            print("Usage: python create_market.py check <platform> <username> <metric_type> [video_id]")
            sys.exit(1)
        video_id = sys.argv[5] if len(sys.argv) > 5 else ""
        cmd_check(sys.argv[2], sys.argv[3], sys.argv[4], video_id)
    elif action == "create":
        # create <platform> <username> <metric_type> <target_value> <deadline> [video_id]
        if len(sys.argv) < 7:
            print('Usage: python create_market.py create <platform> <username> <metric_type> '
                  '<target_value> "<deadline_ISO>" [video_id]')
            sys.exit(1)
        video_id = sys.argv[7] if len(sys.argv) > 7 else ""
        cmd_create(
            platform=sys.argv[2],
            username=sys.argv[3],
            metric_type=sys.argv[4],
            target_value=sys.argv[5],
            deadline=sys.argv[6],
            video_id=video_id,
        )
    else:
        print(__doc__)
        sys.exit(1)


if __name__ == "__main__":
    main()
