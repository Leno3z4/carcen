import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { ChevronDown, User, Copy, LogOut } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { truncateAddress } from "@/lib/utils";

export default function ConnectButton() {
  const { address, isConnected } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }

    if (menuOpen) {
      document.addEventListener("mousedown", handleClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [menuOpen]);

  if (isConnected && address) {
    return (
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="flex items-center gap-2 rounded-full bg-black/5 hover:bg-black/10 transition-colors px-3 py-1.5 text-sm text-text-primary"
        >
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          {truncateAddress(address)}
          <ChevronDown
            className={`h-3.5 w-3.5 text-text-secondary transition-transform ${
              menuOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-full mt-2 w-48 rounded-2xl border border-border bg-card p-1.5 shadow-soft-lg">
            <Link
              to="/profile"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-text-primary hover:bg-black/5"
            >
              <User className="h-4 w-4" />
              Profile
            </Link>

            <button
              onClick={() => {
                navigator.clipboard.writeText(address);
                setMenuOpen(false);
              }}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-text-primary hover:bg-black/5"
            >
              <Copy className="h-4 w-4" />
              Copy Address
            </button>

            <div className="my-1 h-px bg-border" />

            <button
              onClick={() => {
                disconnect();
                setMenuOpen(false);
              }}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-red-500 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Disconnect
            </button>
          </div>
        )}
      </div>
    );
  }

  const connector = connectors[0];

  return (
    <Button
      size="sm"
      onClick={() => connector && connect({ connector })}
      disabled={isPending || !connector}
      className="!bg-arc-blue !text-white hover:!bg-arc-blue-hover"
    >
      {isPending ? "Connecting..." : "Connect Wallet"}
    </Button>
  );
}
