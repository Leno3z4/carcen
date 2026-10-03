# QMS / QWAP Testnet Swapper

A Cloudflare Worker that runs one QWAP testnet swap every 10 minutes.

## Behavior

The worker alternates automatically by balance:

1. If the wallet has USDC, swap the full USDC balance back to WQMS through QwapRouter, then unwrap WQMS back to native QMS.
2. Otherwise, swap exactly 0.5 QMS to USDC through QwapRouter.

This is **testnet-only**. The configured chain is QMS Testnet (chain ID 19480).

## Live testnet configuration

- RPC: https://rpc.testnet.qms.finance
- Chain ID: 19480
- QwapRouter: 0x93AFF45f28e5DF1b55f5AEFEfB807De843b12619
- WQMS: 0x9AA510295aC664A3d5A3182a3eFe959DE2B12c34
- USDC: 0xDfF68E53a0A8275212927c12017f5aB5f1842a04

These addresses were taken from live QMS testnet / Qwap transactions and can change if the testnet is reset.

## Cloudflare secret

Create this Worker secret:

- WALLET_PRIVATE_KEY = private key of a dedicated testnet wallet

Never put the private key in this repository.

## GitHub Actions deployment secrets

Add these GitHub repository secrets:

- CLOUDFLARE_API_TOKEN — Cloudflare API token with permission to deploy Workers
- CLOUDFLARE_ACCOUNT_ID — Cloudflare account ID
- QWAP_TESTNET_PRIVATE_KEY — dedicated QMS testnet wallet private key

The workflow pushes the private key into the Cloudflare Worker as a Worker secret and never writes it to git.

## Local deploy

```bash
npm install
npx wrangler secret put WALLET_PRIVATE_KEY
npm run deploy
```

## Test manually

```bash
npm run dev
```

The HTTP endpoint is a read-only health check. Swaps are triggered by the Cloudflare Cron trigger.

## Important

QMS says the public testnet can be reset and that its test tokens have no monetary value. Use a dedicated burner/testnet account and do not send real funds to it.

<!-- build trigger -->
