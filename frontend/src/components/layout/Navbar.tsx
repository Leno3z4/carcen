import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import ConnectButton from "@/components/wallet/ConnectButton";

const NAV_ITEMS = [
  { label: "Home", path: "/" },
  { label: "Markets", path: "/" },
  { label: "Portfolio", path: "/portfolio" },
  { label: "Profile", path: "/profile" },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-3xl"
    >
      <div className="flex items-center justify-between rounded-2xl bg-[#161616] px-4 py-2.5 shadow-soft-lg">
        <div className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.label}
                to={item.path}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
                  active ? "bg-white text-black" : "text-white/70 hover:text-white"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
        <ConnectButton />
      </div>
    </motion.nav>
  );
}
