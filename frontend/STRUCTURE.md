# Frontend Scaffold — Dummy Structure

This is an empty skeleton, not working code. Every file below is a placeholder
with a one-line comment describing what it's for. Drop this in to replace your
current frontend folder, then Claude Code fills in each file per the prompts
that go with this.

Stack: Vite + React + TypeScript + Tailwind + shadcn/ui + Framer Motion +
viem + wagmi + React Hook Form + Zod + Recharts + react-router-dom.

Config files (package.json, vite.config.ts, tsconfig.json, tailwind.config.ts,
index.html) are NOT included here on purpose — the first Codex prompt handles
project init, which generates those fresh. Adding empty versions here would
just conflict with that step.

## Folder map

- src/lib/ — contract config, ABI, wagmi setup, snapshot fetching, utils
- src/types/ — shared TypeScript types (Market shape, etc.)
- src/hooks/ — data-fetching hooks (markets, single market, snapshots, positions)
- src/components/layout/ — navbar, page shell
- src/components/wallet/ — connect button, connection state handling
- src/components/market/ — market card, grid, filters, chart, trade panel
- src/components/portfolio/ — wallet overview, positions list
- src/components/profile/ — profile card
- src/components/shared/ — skeleton loaders, search bar
- src/pages/ — one file per route
