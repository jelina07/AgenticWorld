import { useRequest } from "ahooks";
import { Options } from "../types";
import request from "../request";
import { useAccount } from "wagmi";
import { AGENT1_ADDRESS } from "../blockChain/address";

export default function useAgentGetMeta(
  options?: Options<any, [string]> & { agentId: number }
) {
  const { address, chainId } = useAccount();
  const { agentId, ...rest } = options || {};

  const result = useRequest(
    async () => {
      if (!address || !agentId || !chainId) {
        return;
      }
      const res = await request.get(`/user-agent/info`, {
        params: {
          wallet: address,
          agentId,
          chainId: chainId,
          agentAddress: AGENT1_ADDRESS[chainId],
        },
      });
      return res;
    },
    {
      refreshDeps: [address],
      ...rest,
    }
  );

  return result;
}
