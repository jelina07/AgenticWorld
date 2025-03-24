import { useRequest } from "ahooks";
import { Options } from "../types";
import useValidateChainWalletLink from "./useValidateChainWalletLink";
import { config } from "../wagimConfig";
import { useWriteContract } from "wagmi";
import { AGENT1_ABI } from "../blockChain/abi";
import { AGENT1_ADDRESS } from "../blockChain/address";
import { estimateGasUtil } from "../utils/script";
import { waitForTransactionReceipt } from "wagmi/actions";
import { exceptionHandler } from "../utils/exception";

export default function useAgentBurn(
  options?: Options<unknown, [number]> & { waitForReceipt?: boolean }
) {
  const { validateAsync, chainId } = useValidateChainWalletLink();
  const { writeContractAsync } = useWriteContract();
  const result = useRequest(
    async (tokenId) => {
      const isValid = await validateAsync?.();
      if (!isValid || !chainId) {
        return;
      }

      // estimate
      const gasEstimate2 = await estimateGasUtil(
        AGENT1_ABI,
        "burn",
        [tokenId],
        AGENT1_ADDRESS[chainId]
      );

      const txHash = await writeContractAsync({
        abi: AGENT1_ABI,
        functionName: "burn",
        address: AGENT1_ADDRESS[chainId],
        args: [tokenId],
        gas: gasEstimate2 + gasEstimate2 / BigInt(3),
      });

      if (!options?.waitForReceipt) {
        return txHash;
      }

      const receipt = await waitForTransactionReceipt(config, { hash: txHash });
      return receipt;
    },
    {
      onError: (err) => exceptionHandler(err, AGENT1_ABI),
      manual: true,
      ...options,
    }
  );

  return result;
}
