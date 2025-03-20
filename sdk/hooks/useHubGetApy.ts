import { useRequest } from "ahooks";
import { Options } from "../types";
import { readContract } from "wagmi/actions";
import { config } from "../wagimConfig";
import { DAO_INSPECTOR_ABI } from "../blockChain/abi";
import { DAO_INSPECTOR_ADDRESS } from "../blockChain/address";
import Big from "big.js";
import { exceptionHandler } from "../utils/exception";
import { useAccount } from "wagmi";

export default function useHubGetApy(options?: Options<any, []> & { hubIds?: any[] }) {
  const { hubIds, ...rest } = options || {};
  const { chainId } = useAccount();

  const result = useRequest(
    async () => {
      if (!hubIds?.length || !chainId) {
        return;
      }
      const justHubIds = hubIds.map((obj: any) => obj.id);
      const amounts = (await readContract(config, {
        abi: DAO_INSPECTOR_ABI,
        functionName: "getAPYBatch",
        address: DAO_INSPECTOR_ADDRESS[chainId],
        args: [justHubIds],
      })) as bigint[];

      console.log("amounts", amounts);

      return amounts.map((amount) => new Big(amount.toString()).div(100).toFixed(0) + "%");
    },
    {
      onError: (err) => exceptionHandler(err),
      refreshDeps: [hubIds, chainId],
      ...rest,
    }
  );

  return result;
}
