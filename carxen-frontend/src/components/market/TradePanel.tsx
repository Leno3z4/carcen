import { useState } from "react";

import Button from "../ui/Button";

export default function TradePanel() {
  const [side, setSide] = useState<"YES" | "NO">("YES");
  const [stake, setStake] = useState("");

  return (
    <div className="space-y-6 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          onClick={() => setSide("YES")}
          className={side === "YES" ? "" : "bg-neutral-200 text-neutral-900 hover:bg-neutral-300"}
        >
          Buy YES
        </Button>

        <Button
          type="button"
          onClick={() => setSide("NO")}
          className={side === "NO" ? "" : "bg-neutral-200 text-neutral-900 hover:bg-neutral-300"}
        >
          Buy NO
        </Button>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-neutral-700">
          Stake (USDC)
        </label>

        <input
          type="number"
          min="0"
          value={stake}
          onChange={(e) => setStake(e.target.value)}
          placeholder="0.00"
          className="h-12 w-full rounded-2xl border border-neutral-200 px-4 outline-none focus:border-blue-500"
        />
      </div>

      <div className="space-y-2 rounded-2xl bg-neutral-50 p-4 text-sm">
        <div className="flex justify-between">
          <span>Your pool share</span>
          <span>--</span>
        </div>

        <div className="flex justify-between">
          <span>Estimated payout</span>
          <span>--</span>
        </div>
      </div>

      <Button className="w-full">
        Confirm Trade
      </Button>
    </div>
}
