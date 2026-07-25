 import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ConnectButton from "@/components/wallet/ConnectButton";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Markets", href: "/" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Profile", href: "/profile" },
];

export default function Navbar() {
  const location = useLocation();

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

          <span>Carcen</span>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "rounded-xl px-4 py-2 text-sm font-medium transition-colors",
                location.pathname === item.href
                  ? "bg-arc-blue text-white"
                  : "text-text-secondary hover:bg-card hover:text-text-primary"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <ConnectButton />
      </div>
    </motion.header>
  );
}