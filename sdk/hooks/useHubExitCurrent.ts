import { useRequest } from "ahooks";
import { Options, WriteConractHooksReturnType } from "../types";
import { useWriteContract } from "wagmi";
import useValidateChainWalletLink from "./useValidateChainWalletLink";
import { isDev, isProd } from "../utils";
import { config, mindnet, mindtestnet } from "../wagimConfig";
import { AGENT1_ABI } from "../blockChain/abi";
import { AGENT1_ADDRESS } from "../blockChain/address";
import { waitForTransactionReceipt } from "wagmi/actions";
import { exceptionHandler } from "../utils/exception";

export default function useHubExitCurrent(
  options?: Options<WriteConractHooksReturnType, [number]> & {
    waitForReceipt?: boolean;
  }
) {
  const { validateAsync, chainId } = useValidateChainWalletLink();
  const { writeContractAsync } = useWriteContract();
  const result = useRequest(
    async (tokenId) => {
      const isValid = await validateAsync?.();
      if (!isValid || !chainId) {
        return;
      }
      const txHash = await writeContractAsync({
        abi: AGENT1_ABI,
        functionName: "exitCurrentHub",
        address: AGENT1_ADDRESS[chainId],
        args: [tokenId],
      });
      if (!options?.waitForReceipt) {
        return txHash;
      }
      const receipt = await waitForTransactionReceipt(config, { hash: txHash });
      return receipt;
    },
    {
      onError: (err) => exceptionHandler(err),
      manual: true,
      ...options,
    }
  );

  return result;
}
