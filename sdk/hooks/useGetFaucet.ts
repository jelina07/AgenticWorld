import { useRequest } from "ahooks";
import { Options } from "../types";
import { waitForTransactionReceipt } from "wagmi/actions";
import { config } from "../wagimConfig";
import { FAUCETABI } from "../blockChain/abi";
import { DAOKEN_ADDRESS, FAUCET_ADDRESS } from "../blockChain/address";
import { exceptionHandler } from "../utils/exception";
import { useAccount, useWriteContract } from "wagmi";
import { estimateGasUtil } from "../utils/script";
import useValidateChainWalletLink from "./useValidateChainWalletLink";

export default function useGetFaucet(
  options?: Options<any, any>,
  waitForReceipt = true
) {
  const { writeContractAsync } = useWriteContract();
  const { validateAsync, address, chainId } = useValidateChainWalletLink();

  const result = useRequest(
    async () => {
      const isValid = await validateAsync?.();
      if (!isValid || !address || !chainId) {
        return;
      }
      const gasEstimate = await estimateGasUtil(
        FAUCETABI,
        "collect",
        [DAOKEN_ADDRESS[chainId], address],
        FAUCET_ADDRESS[chainId]
      );

      const txHash = await writeContractAsync({
        abi: FAUCETABI,
        functionName: "collect",
        address: FAUCET_ADDRESS[chainId],
        args: [DAOKEN_ADDRESS[chainId], address],
        gas: gasEstimate + gasEstimate / BigInt(3),
      });

      if (!waitForReceipt) {
        return txHash;
      }
      const receipt = await waitForTransactionReceipt(config, {
        hash: txHash,
      });
      return receipt;
    },
    {
      onError: (err) => exceptionHandler(err, "facuet", FAUCETABI),
      refreshDeps: [address],
      manual: true,
      ...options,
    }
  );

  return result;
}
