import { useRequest } from "ahooks";
import { Options } from "../types";
import { readContract } from "wagmi/actions";
import { config } from "../wagimConfig";
import { DAO_INSPECTOR_ABI } from "../blockChain/abi";
import { DAO_INSPECTOR_ADDRESS, DAOKEN_ADDRESS } from "../blockChain/address";
import { exceptionHandler } from "../utils/exception";

export default function useHubAgentCount(
  options?: Options<undefined | any[], []> & { hubIds?: any[] }
) {
  const { hubIds, ...rest } = options || {};

  const result = useRequest(
    async () => {
      if (!hubIds || !hubIds.length) {
        return;
      }
      const justHubIds = hubIds.map((obj: any) => obj.id);
      const agentsCount = (await readContract(config, {
        abi: DAO_INSPECTOR_ABI,
        address: DAO_INSPECTOR_ADDRESS.address,
        functionName: "getAgentCount",
        args: [justHubIds],
      })) as bigint[];

      return agentsCount.map((count) => Number(count));
    },
    {
      refreshDeps: [hubIds],
      onError: (err) => exceptionHandler(err),
      ...rest,
    }
  );

  return result;
}
