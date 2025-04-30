import { useRequest } from "ahooks";
import { Options } from "../types";
import { readContract } from "wagmi/actions";
import { chains, config, getTransports } from "../wagimConfig";
import { AGENT1_ABI, DAO_INSPECTOR_ABI } from "../blockChain/abi";
import { AGENT1_ADDRESS, DAO_INSPECTOR_ADDRESS } from "../blockChain/address";
import { exceptionHandler } from "../utils/exception";
import { useAccount } from "wagmi";
import { isSupportChain } from "../utils/script";
import { createPublicClient } from "viem";

export default function useGetAgentCount(options?: Options<any, any>) {
  const result = useRequest(
    async () => {
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
            abi: AGENT1_ABI,
            address: AGENT1_ADDRESS[item.id],
            functionName: "totalSupply",
          })) as bigint;
          return {
            chainId: item.id,
            count: Number(res),
          };
        })
      );
      const allAgent = agentsCountNow.reduce(
        (accumulator, currentValue) => accumulator + currentValue.count,
        0
      );
      console.log("agentsCountNow", agentsCountNow);

      return allAgent;
    },
    {
      onError: (err) => exceptionHandler(err),
      ...options,
    }
  );
  return result;
}
