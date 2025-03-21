import { useRequest } from "ahooks";
import { Options } from "../types";
import request from "../request";
import { useAccount, useSignMessage } from "wagmi";
import { exceptionHandler } from "../utils/exception";
import { AGENT1_ADDRESS } from "../blockChain/address";

type PostData = {
  agentId: number;
  agentName: string;
  avatar: string;
};

export default function useAgentPutMeta(options?: Options<unknown, [PostData]>) {
  const { address, chainId } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const result = useRequest(
    async (postData) => {
      if (!chainId) {
        return;
      }
      // 签名
      const signature = await signMessageAsync({
        message: `You are modifying your agent information on the chain:${chainId}`,
      });
      const res = await request.put("/user-agent/info", {
        ...postData,
        walletAddress: address,
        chainId,
        signature,
        agentAddress: AGENT1_ADDRESS[chainId],
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
