import { useRequest } from "ahooks";
import { Options } from "../types";
import request from "../request";
import { useAccount, useSignMessage } from "wagmi";
import { exceptionHandler } from "../utils/exception";

type PostData = {
  agentId: number;
  agentName: string;
  avatar: string;
  signature: string;
};

export default function useAgentPutMeta(options?: Options<unknown, [PostData]>) {
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const result = useRequest(
    async (postData) => {
      // 签名
      const signature = await signMessageAsync({ message: `You are modifying your agent information.` });
      const res = await request.put("/user-agent", {
        ...postData,
        walletAddress: address,
        signature,
      });
      return res;
    },
    {
      manual: true,
      onError: (err) => exceptionHandler(err),
      ...options,
    }
  );

  return result;
}
