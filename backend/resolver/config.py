"""
Shared config for the resolver + market-creation scripts.
Nothing here costs money — Arc Testnet RPC is free, this is just plumbing.
"""

import os
from dotenv import load_dotenv

load_dotenv()

ARC_RPC_URL = os.environ.get("ARC_RPC_URL", "https://rpc.testnet.arc.network")
MARKET_ADDRESS = os.environ.get("MARKET_ADDRESS")  # set after you deploy the contract
USDC_ADDRESS = "0x3600000000000000000000000000000000000000"

# Two separate keys, on purpose:
#   OWNER_PRIVATE_KEY  — used only by create_market.py (creating markets, admin stuff)
#   RESOLVER_PRIVATE_KEY — used only by resolver.py (can ONLY call resolve()/claimFor()
#                           on-chain since that's all the contract lets resolverBot do)
# Keeping them separate means a compromised resolver bot key can't drain funds or create
# fake markets — the contract itself enforces that boundary.
OWNER_PRIVATE_KEY = os.environ.get("OWNER_PRIVATE_KEY")
RESOLVER_PRIVATE_KEY = os.environ.get("RESOLVER_PRIVATE_KEY")

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
            {"name": "espnLeaguePath", "type": "string"},
            {"name": "espnEventId", "type": "string"},
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
            {"name": "espnLeaguePath", "type": "string"},
            {"name": "espnEventId", "type": "string"},
        ],
    },
    {
        "type": "function", "name": "resolve", "stateMutability": "nonpayable",
        "inputs": [
            {"name": "marketId", "type": "uint256"},
            {"name": "outcome", "type": "uint8"},
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
