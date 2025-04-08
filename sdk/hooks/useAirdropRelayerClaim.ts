import { useRequest } from "ahooks";
import request from "../request";
import { Options } from "../types";
import useValidateChainWalletLink from "./useValidateChainWalletLink";
import { isDev, isProd } from "../utils";
import { mindnet, mindtestnet } from "../wagimConfig";
import { exceptionHandler } from "../utils/exception";
import { useSignMessage } from "wagmi";

export default function useAirdropRelayerClaim(options?: Options<any, any>) {
  const { signMessageAsync } = useSignMessage();
  const { validateAsync, chainId, address } = useValidateChainWalletLink(
    isDev() || isProd() ? mindtestnet.id : mindnet.id
  );
  const result = useRequest(
    async () => {
      const isValid = await validateAsync?.();
      if (!isValid || !address || !chainId) {
        return;
      }
      const signature = await signMessageAsync?.({
        message: "Confirm your $FHE claim.",
      });
      const res = await request.post("/grant/claim", {
        wallet: address,
        signature,
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
