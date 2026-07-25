import { useAccount, useConnect, useDisconnect } from "wagmi";

export default function useWallet() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  return {
    address,
    isConnected,
    connectors,
    connect,
    disconnect,
  };
}
