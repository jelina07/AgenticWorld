import { useRequest } from "ahooks";
import { Options } from "../types";
import { readContract } from "wagmi/actions";
import { config } from "../wagimConfig";
import { AGENT1_ABI, DAO_INSPECTOR_ABI } from "../blockChain/abi";
import { AGENT1_ADDRESS, DAO_INSPECTOR_ADDRESS } from "../blockChain/address";

export default function useHubGetCurrentExp(
  options?: Options<undefined | number[], []> & {
    tokenId?: number;
    hubIds?: number[];
  }
) {
  const { tokenId, hubIds, ...rest } = options || {};
  const result = useRequest(
    async () => {
      if (!tokenId || hubIds?.length === 0) {
        return;
      }
      const currentExp = (await readContract(config, {
        abi: DAO_INSPECTOR_ABI,
        address: DAO_INSPECTOR_ADDRESS.address,
        functionName: "getAgentXpLengthSecBatch",
        args: [tokenId, hubIds],
      })) as bigint[];
      console.log("currentExp", currentExp);

      // 向下取整获取小时
      const learnHour = currentExp.map((item) => Math.floor(Number(item) / 3600));
      return learnHour;
    },
    {
      refreshDeps: [tokenId, hubIds],
      ...rest,
    }
  );

  return result;
}
