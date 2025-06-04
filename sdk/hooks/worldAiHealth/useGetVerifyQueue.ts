import request from "@/sdk/request";
import { Options } from "@/sdk/types";
import { isMainnet, isMainnetio } from "@/sdk/utils";
import { useRequest } from "ahooks";
import { useAccount } from "wagmi";

const url = isMainnet()
  ? "https://agent.mindnetwork.xyz/api/health-hub/queue"
  : isMainnetio()
  ? "https://agent.mindnetwork.io/api/health-hub/queue"
  : "/health-hub/queue";

export default function useGetVerifyQueue(options?: Options<any, any>) {
  const { address } = useAccount();
  const result = useRequest(
    async () => {
      if (!address) {
        return;
      }
      const res = await request.get(url, {
        params: {
          walletAddress: address,
        },
      });

      return res;
    },
    {
      manual: true,
      refreshDeps: [address],
      ...options,
    }
  );
  return result;
}
