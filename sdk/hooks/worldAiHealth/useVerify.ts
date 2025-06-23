import { useRequest } from "ahooks";
import { Options } from "../../types";
import { isDev, isMainnet, isMainnetio, isProd } from "@/sdk/utils";
import request from "@/sdk/request";
import useValidateChainWalletLink from "../useValidateChainWalletLink";
import { bnb, bnbtestnet } from "@/sdk/wagimConfig";
import { useAccount } from "wagmi";

const url = isMainnet()
  ? "https://agent.mindnetwork.xyz/api/health-hub/verify"
  : isMainnetio()
  ? "https://agent.mindnetwork.io/api/health-hub/verify"
  : "/health-hub/verify";
const targetChain: any = isDev() || isProd() ? bnbtestnet.id : bnb.id;

export default function useVerify(options?: Options<any, any>) {
  // const { validateAsync, address } = useValidateChainWalletLink(targetChain);
  const { address } = useAccount();
  const result = useRequest(
    async () => {
      // const isValid = await validateAsync?.();
      if (!address) {
        return;
      }
      const res = await request.post(url, {
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
