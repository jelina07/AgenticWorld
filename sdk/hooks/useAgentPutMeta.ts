import { useRequest } from "ahooks";
import { Options } from "../types";
import request from "../request";

type PostData = {
  walletAddress: string;
  agentId: string;
  agentName: string;
  avatar: string;
};

export default function useAgentPutMeta(options?: Options<unknown, [PostData]>) {
  const result = useRequest(
    async (postData) => {
      const res = await request.put("/user-agent", postData);
      return res;
    },
    {
      manual: true,
      ...options,
    }
  );

  return result;
}
