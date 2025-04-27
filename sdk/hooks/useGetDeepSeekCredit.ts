import { useRequest } from "ahooks";
import { Options } from "../types";
import request from "../request";
import { useAccount } from "wagmi";
import { AGENT1_ADDRESS } from "../blockChain/address";
import { isSupportChain } from "../utils/script";

export default function useGetDeepSeekCredit(options?: Options<any, any>) {
  const { address, chainId } = useAccount();
  const result = useRequest(
    async () => {
      if (!address || !chainId || !isSupportChain(chainId)) {
        return;
      }
      const res = await request.get(`/ai/deepseek/credits`, {
        params: {
          wallet: address,
          chainId,
        },
      });
      return res;
    },
    {
      refreshDeps: [address],
      ...options,
    }
  );

  return result;
}
