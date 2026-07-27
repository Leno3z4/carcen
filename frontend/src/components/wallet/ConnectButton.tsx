import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import {
  ChevronDown,
  User,
  Copy,
  LogOut,
} from "lucide-react";

import Button from "@/components/ui/Button";
import { truncateAddress } from "@/lib/utils";

export default function ConnectButton() {
  const { address, isConnected } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function close(e: MouseEvent) {
      if (
        ref.current &&
        !ref.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", close);

    return () =>
      document.removeEventListener(
        "mousedown",
        close
      );
  }, []);

  if (!isConnected || !address) {
    const connector = connectors[0];

    return (
      <Button
        onClick={() =>
          connector &&
          connect({ connector })
        }
        disabled={!connector || isPending}
        className="rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-6 shadow-lg shadow-blue-500/20"
      >
        {isPending
          ? "Connecting..."
          : "Connect Wallet"}
      </Button>
    );
  }

  return (
    <div
      ref={ref}
      className="relative"
    >
      <button
        onClick={() => setOpen(!open)}
        className="
          flex
          items-center
          gap-3
          rounded-full
          border
          border-blue-100
          bg-white/90
          px-4
          py-2
          shadow-md
          backdrop-blur
          transition
          hover:shadow-lg
        "
      >
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />

        <span className="font-medium">
          {truncateAddress(address)}
        </span>

        <ChevronDown
          className={`h-4 w-4 transition ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div
          className="
            absolute
            right-0
            mt-3
            w-56
            overflow-hidden
            rounded-2xl
            border
            border-blue-100
            bg-white
            shadow-2xl
          "
        >
          <Link
            to="/profile"
            className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50"
            onClick={() => setOpen(false)}
          >
            <User size={18} />
            Profile
          </Link>

          <button
            className="flex w-full items-center gap-3 px-4 py-3 hover:bg-blue-50"
            onClick={() => {
              navigator.clipboard.writeText(address);
              setOpen(false);
            }}
          >
            <Copy size={18} />
            Copy Address
          </button>

          <div className="mx-4 border-t border-blue-100" />

          <button
            className="flex w-full items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50"
            onClick={() => {
              disconnect();
              setOpen(false);
            }}
          >
            <LogOut size={18} />
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
