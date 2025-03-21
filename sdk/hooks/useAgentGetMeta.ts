import { useRequest } from "ahooks";
import { Options } from "../types";
import request from "../request";
import { useAccount } from "wagmi";

export default function useAgentGetMeta(options?: Options<any, [string]> & { agentId: number }) {
  const { address } = useAccount();
  const { agentId, ...rest } = options || {};

  const result = useRequest(
    async () => {
      if (!address) {
        return;
      }
      const res = await request.get(`/user-agent/info`, {
        params: { wallet: address, agentId },
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
