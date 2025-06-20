import request from "@/sdk/request";
import { Options } from "@/sdk/types";
import { isMainnet, isMainnetio } from "@/sdk/utils";
import { useRequest } from "ahooks";
import { useAccount } from "wagmi";

const url = isMainnet()
  ? "https://agent.mindnetwork.xyz/api/health-hub/participate"
  : isMainnetio()
  ? "https://agent.mindnetwork.io/api/health-hub/participate"
  : "/health-hub/participate";

export default function useParticipate(options?: Options<any, any>) {
  const { address } = useAccount();
  const result = useRequest(
    async () => {
      if (!address) {
        return;
      }
      try {
        const res = await request.post(url, {
          walletAddress: address,
        });
        return res;
      } catch (error) {
        return;
      }
    },
    {
      manual: true,
      ...options,
    }
  );
  return result;
}
