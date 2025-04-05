import { useRequest } from "ahooks";
import request from "../request";
import { Options } from "../types";
import useValidateChainWalletLink from "./useValidateChainWalletLink";
import { isDev, isProd } from "../utils";
import { mindnet, mindtestnet } from "../wagimConfig";
import { exceptionHandler } from "../utils/exception";

export default function useAirdropRelayerClaim(options?: Options<any, any>) {
  const { validateAsync, chainId, address } = useValidateChainWalletLink(
    isDev() || isProd() ? mindtestnet.id : mindnet.id
  );
  const result = useRequest(
    async () => {
      const isValid = await validateAsync?.();
      if (!isValid || !address || !chainId) {
        return;
      }
      const res = await request.post("/grant/claim", {
        wallet: address,
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
