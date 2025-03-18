import { useRequest } from "ahooks";
import request from "../request";
import { Options } from "../types";
import { readContract } from "wagmi/actions";
import { config } from "../wagimConfig";
import { MEMBER_POOL_ABI } from "../blockChain/abi";
import { MEMBER_POOL_ADDRESS } from "../blockChain/address";
import { exceptionHandler } from "../utils/exception";

export default function useHubAgentCount(options?: Options<undefined | number, []> & { hubId?: number }) {
  const { hubId, ...rest } = options || {};

  const result = useRequest(
    async () => {
      if (!hubId) {
        return;
      }
      const agentsCount = (await readContract(config, {
        abi: MEMBER_POOL_ABI,
        address: MEMBER_POOL_ADDRESS.address,
        functionName: "hubAgentCount",
        args: [hubId],
      })) as bigint;

      return Number(agentsCount);
    },
    {
      manual: true,
      refreshDeps: [hubId],
      onError: (err) => exceptionHandler(err),
      ...rest,
    }
  );

  return result;
}
