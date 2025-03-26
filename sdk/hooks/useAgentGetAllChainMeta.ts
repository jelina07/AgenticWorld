import { useRequest } from "ahooks";
import { Options } from "../types";
import request from "../request";
import { useAccount } from "wagmi";
import { AGENT1_ADDRESS } from "../blockChain/address";

export default function useAgentGetAllChainMeta(
  agentId: number,
  chainIds: number[],
  options?: Options<any, any>
) {
  const { address } = useAccount();
  const result = useRequest(
    async () => {
      if (!address || !agentId || !chainIds) {
        return;
      }
      const res = await Promise.all(
        chainIds.map(async (chainId) => {
          const res = await request.get(`/user-agent/info`, {
            params: {
              wallet: address,
              agentId,
              chainId: chainId,
              agentAddress: AGENT1_ADDRESS[chainId],
            },
          });
          return { chainId, agentMeta: res };
        })
      );
      return res;
    },
    {
      refreshDeps: [address],
      ...options,
    }
  );

  return result;
}
