import { useRequest } from "ahooks";
import { Options } from "../types";
import { readContract } from "wagmi/actions";
import { config } from "../wagimConfig";
import { DAO_INSPECTOR_ABI } from "../blockChain/abi";
import { DAO_INSPECTOR_ADDRESS } from "../blockChain/address";
import { exceptionHandler } from "../utils/exception";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import { isSupportChain } from "../utils/script";

export default function useGetClaimableReward(
  options?: Options<undefined | string, []> & { address: string }
) {
  const { address, chainId } = useAccount();

  const result = useRequest(
    async () => {
      if (!address || !chainId || !isSupportChain(chainId)) {
        return;
      }
      const amount = (await readContract(config, {
        abi: DAO_INSPECTOR_ABI,
        address: DAO_INSPECTOR_ADDRESS[chainId],
        functionName: "getUserClaimableRewards",
        args: [address],
      })) as bigint;

      return formatEther(amount);
    },
    {
      onError: (err) => exceptionHandler(err),
      refreshDeps: [address, chainId],
      ...options,
    }
  );

  return result;
}
