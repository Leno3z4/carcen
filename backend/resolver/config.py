"""
Shared config for the resolver + market-creation scripts.
Nothing here costs money — Arc Testnet RPC is free, this is just plumbing.
"""

import os
from dotenv import load_dotenv

load_dotenv()

ARC_RPC_URL = os.environ.get("ARC_RPC_URL", "https://rpc.testnet.arc.network")

# Falls back to the current deployed contract if the MARKET_ADDRESS secret is
# missing, empty, or broken (e.g. accidentally saved as "***") — validates it
# actually looks like a real address before trusting it.
_DEFAULT_MARKET_ADDRESS = "0x330f0F8DFdfC5E172817aF032461e009574a9413"
_env_market_address = os.environ.get("MARKET_ADDRESS", "").strip()
if _env_market_address.startswith("0x") and len(_env_market_address) == 42:
    MARKET_ADDRESS = _env_market_address
else:
    MARKET_ADDRESS = _DEFAULT_MARKET_ADDRESS

USDC_ADDRESS = "0x3600000000000000000000000000000000000000"

# Two separate keys, on purpose:
#   OWNER_PRIVATE_KEY  — used only by create_market.py (creating markets, admin stuff)
#   RESOLVER_PRIVATE_KEY — used only by resolver.py (can ONLY call resolve()/claimFor()
#                           on-chain since that's all the contract lets resolverBot do)
# Keeping them separate means a compromised resolver bot key can't drain funds or create
# fake markets — the contract itself enforces that boundary.
OWNER_PRIVATE_KEY = os.environ.get("OWNER_PRIVATE_KEY")
RESOLVER_PRIVATE_KEY = os.environ.get("RESOLVER_PRIVATE_KEY")

# NOTE: This ABI targets the NEW MetricsMarket contract, not the old ESPN one.
# espnLeaguePath/espnEventId are replaced with platform/username/videoId/metricType/targetValue.
# resolve() now also takes measuredValue — sports has a public final score as the audit
# trail; a follower/view count needs to be logged on-chain or a resolution can't be verified
# after the fact. MARKET_ADDRESS above still points at the OLD contract — update it once
# the new one is deployed.
PREDICTION_MARKET_ABI = [
    {
        "type": "function", "name": "nextMarketId", "stateMutability": "view",
        "inputs": [], "outputs": [{"type": "uint256"}],
    },
    {
        "type": "function", "name": "createMarket", "stateMutability": "nonpayable",
        "inputs": [
            {"name": "question", "type": "string"},
            {"name": "closeTime", "type": "uint64"},
            {"name": "platform", "type": "uint8"},      # 0=X, 1=YOUTUBE, 2=TIKTOK
            {"name": "username", "type": "string"},
            {"name": "videoId", "type": "string"},        # empty string if not applicable
            {"name": "metricType", "type": "uint8"},     # 0=FOLLOWERS, 1=VIEWS, 2=SUBSCRIBERS
            {"name": "targetValue", "type": "uint256"},
        ],
        "outputs": [{"name": "marketId", "type": "uint256"}],
    },
    {
        "type": "function", "name": "getMarket", "stateMutability": "view",
        "inputs": [{"name": "marketId", "type": "uint256"}],
        "outputs": [
            {"name": "question", "type": "string"},
            {"name": "closeTime", "type": "uint64"},
            {"name": "outcome", "type": "uint8"},
            {"name": "yesPool", "type": "uint256"},
            {"name": "noPool", "type": "uint256"},
            {"name": "platform", "type": "uint8"},
            {"name": "username", "type": "string"},
            {"name": "videoId", "type": "string"},
            {"name": "metricType", "type": "uint8"},
            {"name": "targetValue", "type": "uint256"},
        ],
    },
    {
        "type": "function", "name": "resolve", "stateMutability": "nonpayable",
        "inputs": [
            {"name": "marketId", "type": "uint256"},
            {"name": "outcome", "type": "uint8"},
            {"name": "measuredValue", "type": "uint256"},
        ],
        "outputs": [],
    },
    {
        "type": "function", "name": "claimFor", "stateMutability": "nonpayable",
        "inputs": [
            {"name": "marketId", "type": "uint256"},
            {"name": "user", "type": "address"},
        ],
        "outputs": [],
    },
    {
        "type": "function", "name": "setResolverBot", "stateMutability": "nonpayable",
        "inputs": [{"name": "bot", "type": "address"}], "outputs": [],
    },
    {
        "type": "event", "name": "Deposited", "anonymous": False,
        "inputs": [
            {"name": "marketId", "type": "uint256", "indexed": True},
            {"name": "user", "type": "address", "indexed": True},
            {"name": "side", "type": "uint8", "indexed": False},
            {"name": "amount", "type": "uint256", "indexed": False},
        ],
    },
]

# Outcome enum, mirrors the Solidity contract exactly.
OUTCOME_UNRESOLVED = 0
OUTCOME_YES = 1
OUTCOME_NO = 2

# Platform enum, mirrors the Solidity contract exactly.
PLATFORM_X = 0
PLATFORM_YOUTUBE = 1
PLATFORM_TIKTOK = 2

# MetricType enum, mirrors the Solidity contract exactly.
METRIC_FOLLOWERS = 0
METRIC_VIEWS = 1
METRIC_SUBSCRIBERS = 2
