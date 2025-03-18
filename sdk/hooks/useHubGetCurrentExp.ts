import { useRequest } from "ahooks";
import { Options } from "../types";
import { readContract } from "wagmi/actions";
import { config } from "../wagimConfig";
import { AGENT1_ABI } from "../blockChain/abi";
import { AGENT1_ADDRESS } from "../blockChain/address";

export default function useHubGetCurrentExp(
  options?: Options<undefined | number, [number, number]> & {
    tokenId?: number;
    hubId?: number;
  }
) {
  const { tokenId, hubId, ...rest } = options || {};
  const result = useRequest(
    async () => {
      if (!tokenId || !hubId) {
        return;
      }
      const currentExp = (await readContract(config, {
        abi: AGENT1_ABI,
        address: AGENT1_ADDRESS.address,
        functionName: "hubExpLengthSec",
        args: [tokenId, hubId],
      })) as bigint;
      console.log("currentExp", currentExp);

      // 向下取整获取小时
      const learnHour = Math.floor(Number(currentExp) / 3600);
      return learnHour;
    },
    {
      refreshDeps: [tokenId, hubId],
      ...rest,
    }
  );

  return result;
}
