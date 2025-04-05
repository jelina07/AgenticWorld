import { useRequest } from "ahooks";
import { Options } from "../types";
import { readContract } from "wagmi/actions";
import { config } from "../wagimConfig";
import { DAO_INSPECTOR_ABI } from "../blockChain/abi";
import { DAO_INSPECTOR_ADDRESS } from "../blockChain/address";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import { isSupportChain } from "../utils/script";
import { exceptionHandler } from "../utils/exception";

export default function useHubGetStakeAmount(
  options?: Options<undefined | string[], []> & { hubIds?: any[] }
) {
  const { hubIds, ...rest } = options || {};
  const { chainId } = useAccount();
  const result = useRequest(
    async () => {
      if (!hubIds?.length || !chainId || !isSupportChain(chainId)) {
        return;
      }
      const justHubIds = hubIds.map((obj: any) => obj.id);
      const amounts = (await readContract(config, {
        abi: DAO_INSPECTOR_ABI,
        functionName: "getHubAssetAmountBatch",
        address: DAO_INSPECTOR_ADDRESS[chainId],
        args: [justHubIds],
      })) as bigint[];

      return amounts.map((amount) => formatEther(amount));
    },
    {
      onError: (err) => exceptionHandler(err),
      refreshDeps: [hubIds, chainId],
      ...rest,
    }
  );

  return result;
}
