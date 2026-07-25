import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import ConnectButton from "@/components/wallet/ConnectButton";

const NAV_ITEMS = [
  { label: "Home", to: "/" },
  { label: "Markets", to: "/#markets" },
  { label: "Portfolio", to: "/portfolio" },
  { label: "Profile", to: "/profile" },
] as const;

export default function Navbar() {
  const location = useLocation();

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed left-1/2 top-4 z-50 w-[min(94vw,900px)] -translate-x-1/2"
    >
      <div className="flex items-center justify-between gap-3 rounded-[24px] border border-white/10 bg-[#121212]/95 px-3 py-3 shadow-soft-lg backdrop-blur">
        <Link
          to="/"
          className="hidden shrink-0 rounded-2xl px-3 py-2 text-sm font-semibold text-white/90 sm:flex"
        >
          Carcen
        </Link>

        <div className="flex flex-1 items-center justify-center gap-1 overflow-x-auto">
          {NAV_ITEMS.map((item) => {
            const active =
              item.to === "/"
                ? location.pathname === "/" && location.hash !== "#markets"
                : item.to === "/#markets"
                  ? location.hash === "#markets"
                  : location.pathname === item.to;

            return (
              <Link
                key={item.label}
                to={item.to}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-white text-black"
                    : "text-white/70 hover:text-white"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="shrink-0">
          <ConnectButton />
        </div>
      </div>
    </motion.nav>
  );
}
