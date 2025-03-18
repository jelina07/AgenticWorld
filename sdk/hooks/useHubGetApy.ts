import { useRequest } from "ahooks";
import { Options } from "../types";
import { readContract } from "wagmi/actions";
import { config } from "../wagimConfig";
import { DAO_INSPECTOR_ABI } from "../blockChain/abi";
import { DAO_INSPECTOR_ADDRESS } from "../blockChain/address";

export default function useHubGetApy(
  options?: Options<any, []> & { hubIds: number[] }
) {
  const { hubIds, ...rest } = options || {};

  const result = useRequest(
    async () => {
      if (!hubIds?.length) {
        return;
      }
      const justHubIds = hubIds.map((obj: any) => obj.id);
      console.log("justHubIds", justHubIds);
      const amounts = (await readContract(config, {
        abi: DAO_INSPECTOR_ABI,
        functionName: "getAPYBatch",
        address: DAO_INSPECTOR_ADDRESS.address,
        args: [justHubIds],
      })) as bigint[];

      return amounts.map((amount) => Number(amount));
    },
    {
      refreshDeps: [hubIds],
      ...rest,
    }
  );

  return result;
}
