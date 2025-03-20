import { useRequest } from "ahooks";
import { Options } from "../types";
import request from "../request";
import { useAccount } from "wagmi";

type PostData = {
  agentId: number;
  agentName: string;
  avatar: string;
};

export default function useAgentPutMeta(
  options?: Options<unknown, [PostData]>
) {
  const { address } = useAccount();
  const result = useRequest(
    async (postData) => {
      const res = await request.put("/user-agent", {
        ...postData,
        walletAddress: address,
      });
      return res;
    },
    {
      manual: true,
      ...options,
    }
  );

  return result;
}
