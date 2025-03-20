import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount, useSwitchChain } from "wagmi";

export default function useValidateChainWalletLink(targetChain?: number) {
  const { address, chainId } = useAccount();
  const { switchChain } = useSwitchChain();
  const { openConnectModal } = useConnectModal();

  const validateAsync = async () => {
    if (!address) {
      openConnectModal?.();
      return false;
    }
    if (targetChain && chainId !== targetChain) {
      switchChain({
        chainId: targetChain,
      });
      return false;
    }
    return true;
  };

  return {
    validateAsync,
    address,
    chainId,
  };
}
