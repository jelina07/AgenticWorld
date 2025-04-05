import { useRequest } from "ahooks";
import request from "../request";
import { Options } from "../types";
import { useSignMessage } from "wagmi";
import { exceptionHandler } from "../utils/exception";

export default function useAirdropCheck(options?: Options<any, [string]>) {
  const { signMessageAsync } = useSignMessage();

  const result = useRequest(
    async (wallet) => {
      const signature = await signMessageAsync?.({
        message:
          "Sign to check the amount of FHE this wallet is eligible to claim.",
      });
      const res = await request.get("/grant/check-eligibility", {
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
