import { useRequest } from "ahooks";
import { Options } from "../types";
import { readContract } from "wagmi/actions";
import { config } from "../wagimConfig";
import { AGENT1_ABI, DAO_INSPECTOR_ABI } from "../blockChain/abi";
import { AGENT1_ADDRESS, DAO_INSPECTOR_ADDRESS } from "../blockChain/address";
import { exceptionHandler } from "../utils/exception";
import { useAccount } from "wagmi";
import { isSupportChain } from "../utils/script";

export default function useGetAgentCount(options?: Options<any, any>) {
  const { chainId } = useAccount();

  const result = useRequest(
    async () => {
      if (!chainId || !isSupportChain(chainId)) {
        return;
      }
      const agentsCount = (await readContract(config, {
        abi: AGENT1_ABI,
        address: AGENT1_ADDRESS[chainId],
        functionName: "totalSupply",
      })) as bigint;

      return agentsCount.toString();
    },
    {
      refreshDeps: [chainId],
      onError: (err) => exceptionHandler(err),
      ...options,
    }
  );

  return result;
}
