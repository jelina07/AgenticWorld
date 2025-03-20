import { useRequest } from "ahooks";
import { Options } from "../types";
import { readContract } from "wagmi/actions";
import { config } from "../wagimConfig";
import { DAO_INSPECTOR_ABI } from "../blockChain/abi";
import { DAO_INSPECTOR_ADDRESS } from "../blockChain/address";
import { exceptionHandler } from "../utils/exception";
import { formatEther } from "viem";
import { useAccount } from "wagmi";

export default function useHubGetReward(
  options?: Options<string[] | undefined, []> & {
    hubIds?: any[];
    tokenId: number;
  }
) {
  const { hubIds, tokenId, ...rest } = options || {};
  const { chainId } = useAccount();

  const result = useRequest(
    async () => {
      if (!hubIds?.length || !tokenId || !chainId) {
        return;
      }
      const amounts = (await readContract(config, {
        abi: DAO_INSPECTOR_ABI,
        functionName: "getAgentLifetimeRewardsBatch",
        address: DAO_INSPECTOR_ADDRESS[chainId],
        args: [tokenId, hubIds],
      })) as bigint[];

      return amounts.map((amount) => formatEther(amount));
    },
    {
      onError: (err) => exceptionHandler(err),
      refreshDeps: [hubIds, tokenId, chainId],
      ...rest,
    }
  );

  return result;
}
