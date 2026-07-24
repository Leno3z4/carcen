import Button from "../ui/Button";

type ConnectWalletButtonProps = {
  connected?: boolean;
  address?: string;
  onConnect?: () => void;
};

export default function ConnectWalletButton({
  connected = false,
  address,
  onConnect,
}: ConnectWalletButtonProps) {
  if (connected && address) {
    return (
      <Button type="button">
        {`${address.slice(0, 6)}...${address.slice(-4)}`}
      </Button>
    );
  }

  return (
    <Button type="button" onClick={onConnect}>
      Connect Wallet
    </Button>
  );
}
