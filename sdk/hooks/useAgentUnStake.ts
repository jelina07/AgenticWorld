import { useRequest } from "ahooks";
import { Options } from "../types";
import { useWriteContract } from "wagmi";
import { exceptionHandler } from "../utils/exception";
import useValidateChainWalletLink from "./useValidateChainWalletLink";
import { AGENT1_ABI } from "../blockChain/abi";
import { AGENT1_ADDRESS } from "../blockChain/address";
import { waitForTransactionReceipt } from "wagmi/actions";
import { config } from "../wagimConfig";
import { parseEther } from "viem";
import { estimateGasUtil } from "../utils/script";
import { type EstimateGasErrorType } from "@wagmi/core";

export default function useAgentUnStake(
  options?: Options<unknown, [number, string]> & { waitForReceipt?: boolean }
) {
  const { validateAsync, chainId } = useValidateChainWalletLink();
  const { writeContractAsync } = useWriteContract();

  const result = useRequest(
    async (tokenId, amount) => {
      const isValid = await validateAsync?.();
      if (!isValid || !chainId) {
        return;
      }
      const gasEstimate = await estimateGasUtil(
        AGENT1_ABI,
        "unstake",
        [tokenId, parseEther(amount)],
        AGENT1_ADDRESS[chainId]
      );
      //unstake
      const txHash2 = await writeContractAsync({
        abi: AGENT1_ABI,
        functionName: "unstake",
        address: AGENT1_ADDRESS[chainId],
        args: [tokenId, parseEther(amount)],
        gas: gasEstimate + gasEstimate / BigInt(3),
      });
      if (!options?.waitForReceipt) {
        return txHash2;
      }
      const receipt = await waitForTransactionReceipt(config, {
        hash: txHash2,
      });
      return receipt;
    },
    {
      manual: true,
      onError: (err) => exceptionHandler(err, AGENT1_ABI),
      ...options,
    }
  );

  return result;
}
