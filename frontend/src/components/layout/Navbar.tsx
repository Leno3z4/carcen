import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ConnectButton from "@/components/wallet/ConnectButton";

export default function Navbar() {
  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="fixed inset-x-0 top-5 z-50 flex justify-center px-5"
    >
      <div
        className="
          w-full
          max-w-7xl
          rounded-3xl
          border
          border-blue-100/70
          bg-white/75
          backdrop-blur-2xl
          shadow-[0_20px_45px_rgba(59,130,246,.08)]
          px-7
          py-4
          flex
          items-center
          justify-between
        "
      >
        <Link
          to="/"
          className="group flex items-center gap-4"
        >
          <div
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-2xl
              bg-gradient-to-br
              from-sky-400
              via-blue-500
              to-blue-600
              text-lg
              font-bold
              text-white
              shadow-lg
              shadow-blue-500/25
              transition-transform
              duration-300
              group-hover:scale-105
            "
          >
            C
          </div>

          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900">
              CarXen
            </h1>

            <p className="text-xs text-slate-500">
              Social Prediction Markets
            </p>
          </div>
        </Link>

        <ConnectButton />
      </div>
    </motion.header>
  );
}
