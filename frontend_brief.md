# Arc Social Prediction Market Frontend

Build a modern, production-ready frontend for an Arc-based prediction market
focused exclusively on predicting YouTube video view counts and X (Twitter)
follower growth over short durations. This is not a general prediction market
like Polymarket. Do not include sports, politics, crypto prices, or any other
market categories.

The application should feel like a premium financial application combined
with a modern social analytics dashboard. Prioritize simplicity, whitespace,
clean typography, and smooth interactions over flashy visuals. Avoid making
it look like a generic AI-generated SaaS landing page or a crypto exchange.

---

## Tech Stack

Use:
- Vite
- React
- TypeScript
- React Router (client-side routing — this is a single-page app, no server rendering)
- Tailwind CSS
- shadcn/ui
- Framer Motion
- viem
- wagmi
- React Hook Form
- Zod
- Recharts

Structure the project with reusable components and clean separation of
concerns. Everything is a client-side component — there's no server/client
split to manage, since this is a pure SPA talking directly to the chain.

---

## Design Language

The interface should be minimal, premium, and modern.

Use:
- Background: `#FAFAFA`
- Cards: White
- Primary text: `#111111`
- Secondary text: `#6B7280`
- Accent: Arc blue
- Border radius: 16–20px
- Soft shadows only

Avoid gradients, glassmorphism, neon glows, oversized hero sections, feature
grids, marketing sections, unnecessary badges, or anything that makes the
site feel AI-generated.

Use Inter or Geist for typography. Spacing should be generous and consistent.

---

## Navigation

Floating, fixed while scrolling, matte dark finish, rounded sculpted edges,
soft shadow, premium appearance. Take inspiration from the reference image
provided separately — industrial, aerodynamic feel, don't copy it directly.

Nav items: Home / Markets / Portfolio / Profile
Right side: Connect Wallet, user avatar after connection

Hover animations should be subtle.

---

## Home Page

Immediately shows active prediction markets. No marketing hero section.

Top section:
- Search creators
- Platform filter (YouTube / X)
- Metric filter (Views / Followers)
- Duration filter (1 Hour / 3 Hours / 6 Hours / 10 Hours)

Below that: prediction cards in a grid.

---

## Market Card

Each card contains:
- Creator avatar, name, platform icon
- Prediction question
- Current metric / target metric
- Progress indicator
- Countdown timer
- YES probability / NO probability
- Trading volume
- Live update badge
- Trade button

**Probability calculation:** the YES/NO split shown on every card and on the
market detail page is derived directly from the pool balance —
`yesPool / (yesPool + noPool)`. This is not a separate oracle or pricing
feed; it's a straightforward read from the contract's existing pool state.

Example:
> YouTube — MrBeast
> Will this video reach 3,000,000 views within 3 hours?
> Current: 2,410,000 · Target: 3,000,000
> YES 68% · NO 32%
> Volume: 12,430 ARC · Updated 12 seconds ago

---

## Market Details Page

Shows:
- Creator information
- Prediction title
- Current metric / target metric / remaining time
- A clean line chart showing metric growth over time
- Market statistics (participants, volume, probability)
- Trade panel

**Growth chart data source:** the backend resolver logs a snapshot of the
metric roughly every 15 minutes while a market is open, committed as JSON to
the repo. Fetch each market's history from:

```
https://raw.githubusercontent.com/<owner>/<repo>/main/data/snapshots/<marketId>.json
```

Format: `[{"t": 1721770000, "v": 2410000}, ...]` — `t` is a unix timestamp,
`v` is the metric value at that point. Plot directly with Recharts. Handle
the case where a market is brand new and has zero or one data points yet
(show a placeholder state, not a broken chart).

**Trade panel:**
- Buy YES / Buy NO toggle
- Stake input (in USDC — Arc's native gas token, plain value input, no token
  approval step needed)
- Show the user's resulting share of the pool and estimated payout if that
  side wins, computed from current pool ratios plus their stake — not
  "shares" in the Polymarket sense, since this contract is a pari-mutuel
  pool, not an order book or bonding curve. Frame this as "if YES wins, you
  receive your stake back plus a proportional cut of the losing pool."
- Confirm trade button

---

## Portfolio

Wallet overview card at the top, showing:
- Wallet address
- ARC balance
- Portfolio value
- Today's P/L
- Total profit/loss

Quick actions: **Claim Rewards**, **Copy Address**.

(Deposit/Withdraw are out of scope for this version — the contract has no
wallet-balance abstraction, bets are placed directly from the connected
wallet. Revisit only if a v2 introduces bridging or an internal balance.)

Below that:
- Open Positions
- Resolved Markets
- Claimable Rewards

Each position shows: prediction, YES or NO side, amount, current value,
profit/loss, remaining time.

---

## Profile

Keep simple: profile picture, username, wallet, prediction accuracy, markets
participated, total winnings, recent activity.

---

## Search

Search only creators. Searching filters creators across YouTube and X
instantly. Selecting a creator opens a page showing every active and
completed market for that creator.

---

## Wallet

Support wallet connection via wagmi. Handle every state distinctly:
disconnected, connecting, connected, wrong network, transaction pending,
transaction confirmed, transaction failed.

---

## Animations

Subtle throughout. Cards lift slightly on hover. Numbers animate smoothly.
Countdown updates live. Charts animate naturally. Use loading skeletons
instead of spinners where appropriate.

---

## Responsiveness

Desktop first, tablet supported, mobile supported. Navigation adapts
cleanly. Cards stack naturally. No horizontal scrolling.

---

## Code Quality

- Reusable, small components
- No duplicated code
- Strict TypeScript
- Clean file organization
- Lazy-load heavy components (chart library, wallet modal) where it helps
  initial load time

---

## Things Not to Build

Do not include: hero sections, marketing sections, feature grids,
testimonials, pricing pages, comment sections, social feeds, copy trading,
leaderboards, AI summaries, glassmorphism, heavy gradients, overly flashy
crypto dashboard elements, or a Deposit/Withdraw flow (see Portfolio section
above).

---

## Goal

The final product should feel like a polished, premium application for
predicting short-term YouTube view counts and X follower growth on Arc.
Users browse live markets, trade on predictions, manage their portfolio, and
monitor positions through a clean, fast, professional interface — clarity
and responsiveness over excessive features or visual effects.
