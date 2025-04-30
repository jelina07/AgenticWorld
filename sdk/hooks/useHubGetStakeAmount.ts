import { useRequest } from "ahooks";
import { Options } from "../types";
import { readContract } from "wagmi/actions";
import { chains, config, getTransports } from "../wagimConfig";
import { DAO_INSPECTOR_ABI } from "../blockChain/abi";
import { DAO_INSPECTOR_ADDRESS } from "../blockChain/address";
import { createPublicClient, formatEther } from "viem";
import { useAccount } from "wagmi";
import { isSupportChain } from "../utils/script";
import { exceptionHandler } from "../utils/exception";

export default function useHubGetStakeAmount(
  options?: Options<undefined | string[], []> & { hubIds?: any[] }
) {
  const { hubIds, ...rest } = options || {};
  const { chainId } = useAccount();
  // const result = useRequest(
  //   async () => {
  //     if (!hubIds?.length || !chainId || !isSupportChain(chainId)) {
  //       return;
  //     }
  //     const justHubIds = hubIds.map((obj: any) => obj.id);
  //     const amounts = (await readContract(config, {
  //       abi: DAO_INSPECTOR_ABI,
  //       functionName: "getHubAssetAmountBatch",
  //       address: DAO_INSPECTOR_ADDRESS[chainId],
  //       args: [justHubIds],
  //     })) as bigint[];
  //     console.log("amounts", amounts);

  //     return amounts.map((amount) => formatEther(amount));
  //   },
  //   {
  //     onError: (err) => exceptionHandler(err),
  //     refreshDeps: [hubIds, chainId],
  //     ...rest,
  //   }
  // );

  const result = useRequest(
    async () => {
      if (!hubIds?.length) {
        return;
      }
      const justHubIds = hubIds.map((obj: any) => obj.id);
      const agentsCountNow = await Promise.all(
        chains.map(async (item: any) => {
          const publicClient = createPublicClient({
            batch: {
              multicall: true,
            },
            chain: item,
            transport: getTransports(item.id),
          });

          const res = (await publicClient.readContract({
            abi: DAO_INSPECTOR_ABI,
            address: DAO_INSPECTOR_ADDRESS[item.id],
            functionName: "getHubAssetAmountBatch",
            args: [justHubIds],
          })) as bigint[];

          const hubsCount = hubIds.map((hubId: number, index: number) => {
            return {
              chainId: item.id,
              hubId: hubId,
              amount: String(res[index]),
            };
          });
          return res;
        })
      );
      const result = agentsCountNow[0].map((_: bigint, colIndex: number) =>
        agentsCountNow.reduce((sum, row) => sum + row[colIndex], BigInt(0))
      ) as bigint[];
      console.log("result", result);
      return result.map((amount: bigint) => formatEther(amount));
    },
    {
      onError: (err) => exceptionHandler(err),
      refreshDeps: [hubIds],
      ...rest,
    }
  );

  return result;
}
