import { useCallback, useEffect, useState } from "react";
import { createPublicClient, createWalletClient, custom, http, type Address } from "viem";
import { arcTestnet } from "../lib/chain";

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on?: (event: string, handler: (...args: unknown[]) => void) => void;
      removeListener?: (event: string, handler: (...args: unknown[]) => void) => void;
    };
  }
}

export const publicClient = createPublicClient({
  chain: arcTestnet,
  transport: http(),
});

const ARC_CHAIN_ID_HEX = `0x${arcTestnet.id.toString(16)}`;

export function useWallet() {
  const [address, setAddress] = useState<Address | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wrongNetwork, setWrongNetwork] = useState(false);

  const walletClient = window.ethereum
    ? createWalletClient({ chain: arcTestnet, transport: custom(window.ethereum) })
    : null;

  const checkNetwork = useCallback(async () => {
    if (!window.ethereum) return;
    const chainId = (await window.ethereum.request({ method: "eth_chainId" })) as string;
    setWrongNetwork(chainId.toLowerCase() !== ARC_CHAIN_ID_HEX.toLowerCase());
  }, []);

  const switchToArc = useCallback(async () => {
    if (!window.ethereum) return;
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: ARC_CHAIN_ID_HEX }],
      });
    } catch (err: unknown) {
      // 4902 = chain not added to wallet yet
      const code = (err as { code?: number })?.code;
      if (code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: ARC_CHAIN_ID_HEX,
              chainName: arcTestnet.name,
              nativeCurrency: arcTestnet.nativeCurrency,
              rpcUrls: [arcTestnet.rpcUrls.default.http[0]],
              blockExplorerUrls: [arcTestnet.blockExplorers.default.url],
            },
          ],
        });
      } else {
        throw err;
      }
    }
    await checkNetwork();
  }, [checkNetwork]);

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      setError("No wallet found. Install MetaMask, Rabby, or another EVM wallet.");
      return;
    }
    setConnecting(true);
    setError(null);
    try {
      const accounts = (await window.ethereum.request({
        method: "eth_requestAccounts",
      })) as string[];
      setAddress(accounts[0] as Address);
      await checkNetwork();
    } catch {
      setError("Connection request was rejected.");
    } finally {
      setConnecting(false);
    }
  }, [checkNetwork]);

  useEffect(() => {
    if (!window.ethereum?.on) return;
    const handleAccountsChanged = (...args: unknown[]) => {
      const accounts = args[0] as string[];
      setAddress((accounts[0] as Address) ?? null);
    };
    const handleChainChanged = () => {
      void checkNetwork();
    };
    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);
    return () => {
      window.ethereum?.removeListener?.("accountsChanged", handleAccountsChanged);
      window.ethereum?.removeListener?.("chainChanged", handleChainChanged);
    };
  }, [checkNetwork]);

  return { address, connecting, error, wrongNetwork, connect, switchToArc, walletClient };
}
