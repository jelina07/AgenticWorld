import request from "@/sdk/request";
import { Options } from "@/sdk/types";
import { isMainnet, isMainnetio } from "@/sdk/utils";
import { useRequest } from "ahooks";
import { useAccount } from "wagmi";

const url = isMainnet()
  ? "https://agent.mindnetwork.xyz/api/health-hub/upload-status"
  : isMainnetio()
  ? "https://agent.mindnetwork.io/api/health-hub/upload-status"
  : "/health-hub/upload-status";

export default function useGetUploadStatus(options?: Options<any, any>) {
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
