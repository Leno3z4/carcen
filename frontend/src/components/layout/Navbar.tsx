import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ConnectButton from "@/components/wallet/ConnectButton";

export default function Navbar() {
  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-x-0 top-4 z-50 flex justify-center px-4"
    >
      <div className="flex w-full max-w-7xl items-center justify-between rounded-2xl border border-border/60 bg-background/80 px-5 py-3 shadow-lg backdrop-blur-xl">
        <Link
          to="/"
          className="flex items-center gap-2 text-lg font-semibold tracking-tight"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-arc-blue text-white font-bold">
            C
          </div>
          <span>CarXen</span>
        </Link>

        <ConnectButton />
      </div>
    </motion.header>
  );
}