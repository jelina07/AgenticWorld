import { useRequest } from "ahooks";
import { Options } from "../types";
import { useAccount, useSwitchChain, useWriteContract } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { isDev } from "../utils";
import { mindtestnet } from "../wagimConfig";
import { AIRDROP_ABI } from "../blockChain/abi";
import { AIRDROP_ADDRESS } from "../blockChain/address";
import { exceptionHandler } from "../utils/exception";
import { waitForTransactionReceipt } from "wagmi/actions";
import { config } from "../wagimConfig";

export default function useAirdropClaim(options?: Options<unknown, [string, string[]]> & { waitForReceipt?: boolean }) {
  const { address, chainId } = useAccount();
  const { switchChain } = useSwitchChain();
  const { openConnectModal } = useConnectModal();
  const { writeContractAsync } = useWriteContract();

  const result = useRequest(
    async (amount: string, proof: string[]) => {
      if (!address) {
        openConnectModal?.();
        return;
      }
      if (isDev() && chainId !== mindtestnet.id) {
        switchChain({
          chainId: mindtestnet.id,
        });
        return;
      }
      const txHash = await writeContractAsync({
        abi: AIRDROP_ABI,
        functionName: "claim",
        address: AIRDROP_ADDRESS.address,
        args: [amount, proof],
        // gas: BigInt(1000000),
      });
      if (!options?.waitForReceipt) {
        return txHash;
      }
      const receipt = await waitForTransactionReceipt(config, { hash: txHash });
      return receipt;
    },
    {
      manual: true,
      onError: (err) => exceptionHandler(err),
      ...options,
    }
  );

  return result;
}
