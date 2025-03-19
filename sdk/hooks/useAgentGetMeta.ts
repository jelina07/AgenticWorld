import { useRequest } from "ahooks";
import { Options } from "../types";
import request from "../request";

export default function useAgentGetMeta(options?: Options<unknown, [string]> & { wallet: string; agentId: number }) {
  const { wallet, agentId, ...rest } = options || {};

  const result = useRequest(
    async () => {
      if (!wallet) {
        return;
      }
      const res = await request.get(`/user-agent`, { params: { wallet, agentId } });
      return res;
    },
    {
      refreshDeps: [wallet],
      ...rest,
    }
  );

  return result;
}
