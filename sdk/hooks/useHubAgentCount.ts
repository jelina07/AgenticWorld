import { useRequest } from "ahooks";
import { Options } from "../types";
import { readContract } from "wagmi/actions";
import { config } from "../wagimConfig";
import { DAO_INSPECTOR_ABI } from "../blockChain/abi";
import { DAOKEN_ADDRESS } from "../blockChain/address";
import { exceptionHandler } from "../utils/exception";

export default function useHubAgentCount(options?: Options<undefined | number[], []> & { hubIds?: number[] }) {
  const { hubIds, ...rest } = options || {};

  const result = useRequest(
    async () => {
      if (!hubIds || !hubIds.length) {
        return [];
      }
      const agentsCount = (await readContract(config, {
        abi: DAO_INSPECTOR_ABI,
        address: DAOKEN_ADDRESS.address,
        functionName: "getAgentCount",
        args: [hubIds],
      })) as bigint[];

      return agentsCount.map((count) => Number(count));
    },
    {
      manual: true,
      refreshDeps: [hubIds],
      onError: (err) => exceptionHandler(err),
      ...rest,
    }
  );

  return result;
}
