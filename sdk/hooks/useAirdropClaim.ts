import { useRequest } from "ahooks";
import { Options } from "../types";
import { useWriteContract } from "wagmi";
import { isDev, isProd } from "../utils";
import { mindnet, mindtestnet } from "../wagimConfig";
import { AIRDROP_ABI } from "../blockChain/abi";
import { AIRDROP_ADDRESS } from "../blockChain/address";
import { exceptionHandler } from "../utils/exception";
import { waitForTransactionReceipt } from "wagmi/actions";
import { config } from "../wagimConfig";
import useValidateChainWalletLink from "./useValidateChainWalletLink";
import { estimateGasUtil } from "../utils/script";

export default function useAirdropClaim(options?: Options<unknown, [string, string[]]> & { waitForReceipt?: boolean }) {
  const { validateAsync, chainId } = useValidateChainWalletLink(isDev() || isProd() ? mindtestnet.id : mindnet.id);
  const { writeContractAsync } = useWriteContract();

  const result = useRequest(
    async (amount: string, proof: string[]) => {
      const isValid = await validateAsync?.();
      if (!isValid || !chainId) {
        return;
      }
      const gasEstimate = await estimateGasUtil(AIRDROP_ABI, "claim", [amount, proof], AIRDROP_ADDRESS[chainId]);
      const txHash = await writeContractAsync({
        abi: AIRDROP_ABI,
        functionName: "claim",
        address: AIRDROP_ADDRESS[chainId!],
        args: [amount, proof],
        gas: gasEstimate + gasEstimate / BigInt(3),
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
