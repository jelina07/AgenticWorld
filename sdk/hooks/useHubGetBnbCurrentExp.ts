import { useRequest } from "ahooks";
import { Options } from "../types";
import { readContract } from "wagmi/actions";
import { bnb, bnbtestnet, config, getTransports } from "../wagimConfig";
import { AGENT1_ABI, DAO_INSPECTOR_ABI } from "../blockChain/abi";
import { AGENT1_ADDRESS, DAO_INSPECTOR_ADDRESS } from "../blockChain/address";
import { exceptionHandler } from "../utils/exception";
import { useMemo } from "react";
import { useAccount } from "wagmi";
import { isSupportChain } from "../utils/script";
import { isDev, isProd } from "../utils";
import { createPublicClient } from "viem";

const bnbChainId = isDev() || isProd() ? bnbtestnet.id : bnb.id;
const publicClientBsc = createPublicClient({
  batch: {
    multicall: true,
  },
  chain: isDev() || isProd() ? bnbtestnet : bnb,
  transport: getTransports(bnbChainId),
});

export default function useHubGetBnbCurrentExp(
  options?: Options<bigint[] | undefined, []> & {
    tokenId?: number;
    hubIds?: number[];
    learningId?: number;
  }
) {
  const { tokenId, hubIds, learningId, ...rest } = options || {};
  const { chainId } = useAccount();
  const result = useRequest(
    async () => {
      if (!tokenId || hubIds?.length === 0 || !chainId) {
        return;
      }
      const currentExp = (await publicClientBsc.readContract({
        abi: DAO_INSPECTOR_ABI,
        address: DAO_INSPECTOR_ADDRESS[bnbChainId],
        functionName: "getAgentXpLengthSecBatch",
        args: [tokenId, hubIds],
      })) as bigint[];

      return currentExp;
    },
    {
      refreshDeps: [tokenId, hubIds, learningId],
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
