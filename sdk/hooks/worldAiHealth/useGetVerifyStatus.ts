import { useRequest } from "ahooks";
import { Options } from "../../types";
import { isDev, isMainnet, isMainnetio, isProd } from "@/sdk/utils";
import request from "@/sdk/request";

import { useAccount } from "wagmi";

const url = isMainnet()
  ? "https://agent.mindnetwork.xyz/api/health-hub/status"
  : isMainnetio()
  ? "https://agent.mindnetwork.io/api/health-hub/status"
  : "/health-hub/status";

export default function useGetVerifyStatus(options?: Options<any, any>) {
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
