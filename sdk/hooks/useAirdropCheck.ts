import { useRequest } from "ahooks";
import request from "../request";
import { Options } from "../types";
import { useSignMessage } from "wagmi";
import { exceptionHandler } from "../utils/exception";
import { isMainnet, isMainnetio } from "../utils";

const url = isMainnet()
  ? "https://event-api.mindnetwork.xyz/grant/cex/register"
  : isMainnetio()
  ? "https://event-api.mindnetwork.io/grant/cex/register"
  : "/grant/cex/register";

export default function useAirdropCheck(options?: Options<any, [string]>) {
  const { signMessageAsync } = useSignMessage();

  const result = useRequest(
    async (wallet) => {
      const signature = await signMessageAsync?.({
        message:
          "Sign to check the amount of FHE this wallet is eligible to claim.",
      });
      const res = await request.get(url, {
        params: { wallet, signature },
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
