import { useRequest } from "ahooks";
import { Options } from "../types";
import useValidateChainWalletLink from "./useValidateChainWalletLink";
import { config, mindnet, mindtestnet } from "../wagimConfig";
import { isDev, isProd } from "../utils";
import { useWriteContract } from "wagmi";
import { estimateGasUtil } from "../utils/script";
import { AGENT1_ABI } from "../blockChain/abi";
import { AGENT1_ADDRESS } from "../blockChain/address";
import { waitForTransactionReceipt } from "wagmi/actions";
import { exceptionHandler } from "../utils/exception";

export default function useClaimReward(
  options?: Options<unknown, []> & { waitForReceipt?: boolean }
) {
  const { validateAsync, address } = useValidateChainWalletLink(
    isDev() || isProd() ? mindtestnet.id : mindnet.id
  );

  const { writeContractAsync } = useWriteContract();

  const request = useRequest(
    async () => {
      const isValid = await validateAsync?.();
      if (!isValid) {
        return;
      }

      const gasEstimate = await estimateGasUtil(
        AGENT1_ABI,
        "claimReward",
        [address],
        AGENT1_ADDRESS.address
      );

      const txHash = await writeContractAsync({
        abi: AGENT1_ABI,
        functionName: "claimReward",
        address: AGENT1_ADDRESS.address,
        args: [address],
        gas: gasEstimate + gasEstimate / BigInt(3),
      });

      if (!options?.waitForReceipt) {
        return txHash;
      }
      const receipt = await waitForTransactionReceipt(config, {
        hash: txHash,
      });
      return receipt;
    },
    {
      onError: (err) => exceptionHandler(err),
      manual: true,
      ...options,
    }
  );

  return request;
}
