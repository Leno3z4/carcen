import { useAccount } from "wagmi";
import { motion } from "framer-motion";
import {
  Trophy,
  Wallet,
  Target,
  TrendingUp,
} from "lucide-react";

interface Props {
  accuracy: number;
  marketsParticipated: number;
  totalWinnings: number;
  totalPnl: number;
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-blue-100 bg-gradient-to-b from-white to-blue-50 p-4">
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
        {icon}
      </div>

      <p className="text-xs uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-xl font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}

export default function ProfileCard({
  accuracy,
  marketsParticipated,
  totalWinnings,
  totalPnl,
}: Props) {
  const { address } = useAccount();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-[30px] border border-blue-100 bg-white shadow-[0_20px_60px_rgba(59,130,246,.08)]"
    >
      <div className="h-24 bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500" />

      <div className="-mt-10 px-6 pb-6">

        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-white shadow-lg">
          <Wallet className="h-9 w-9 text-blue-600" />
        </div>

        <div className="mt-5 text-center">

          <h2 className="text-2xl font-bold text-slate-900">
            Your Profile
          </h2>

          <p className="mt-2 break-all text-sm text-slate-500">
            {address ?? "Wallet not connected"}
          </p>

        </div>

        <div className="mt-8 space-y-4">

          <Stat
            icon={<Target size={20} />}
            label="Accuracy"
            value={`${accuracy.toFixed(1)}%`}
          />

          <Stat
            icon={<TrendingUp size={20} />}
            label="Markets"
            value={marketsParticipated.toString()}
          />

          <Stat
            icon={<Trophy size={20} />}
            label="Winnings"
            value={`${totalWinnings.toFixed(2)} USDC`}
          />

          <Stat
            icon={<Wallet size={20} />}
            label="P/L"
            value={`${totalPnl >= 0 ? "+" : ""}${totalPnl.toFixed(2)} USDC`}
          />

        </div>
      </div>
    </motion.div>
  );
}
