import { useRequest } from "ahooks";
import { Options } from "../../types";
import { isDev, isMainnet, isMainnetio, isProd } from "@/sdk/utils";
import request from "@/sdk/request";
import useValidateChainWalletLink from "../useValidateChainWalletLink";
import { bnb, bnbtestnet } from "@/sdk/wagimConfig";
import { useAccount } from "wagmi";

const url = isMainnet()
  ? "https://agent.mindnetwork.xyz/api/health-hub/isPhaseOne"
  : isMainnetio()
  ? "https://agent.mindnetwork.io/api/health-hub/isPhaseOne"
  : "/health-hub/isPhaseOne";

export default function useIsPhaseOne(options?: Options<any, any>) {
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
      refreshDeps: [address],
      ...options,
    }
  );

  return result;
}
