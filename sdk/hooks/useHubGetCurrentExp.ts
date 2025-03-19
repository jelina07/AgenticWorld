import { useRequest } from "ahooks";
import { Options } from "../types";
import { readContract } from "wagmi/actions";
import { config } from "../wagimConfig";
import { AGENT1_ABI, DAO_INSPECTOR_ABI } from "../blockChain/abi";
import { AGENT1_ADDRESS, DAO_INSPECTOR_ADDRESS } from "../blockChain/address";
import { exceptionHandler } from "../utils/exception";
import { useMemo } from "react";

export default function useHubGetCurrentExp(
  options?: Options<bigint[] | undefined, []> & {
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
      // const learnHour = currentExp.map((item) =>
      //   Math.floor(Number(item) / 3600)
      // );
      // const learnSecond = currentExp.map((item) => Math.floor(Number(item)));
      return currentExp;
    },
    {
      refreshDeps: [tokenId, hubIds],
      onError: (err) => exceptionHandler(err),
      ...rest,
    }
  );
  const currentLearnTime = useMemo(() => {
    const learnHour = result.data?.map((item: any) =>
      Math.floor(Number(item) / 3600)
    );
    const learnSecond = result.data?.map((item: any) => Number(item));
    return {
      learnHour,
      learnSecond,
    };
  }, [result]);
  return {
    ...result,
    learnHour: currentLearnTime.learnHour,
    learnSecond: currentLearnTime.learnSecond,
  };
}
