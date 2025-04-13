import { useRequest } from "ahooks";
import request from "../request";
import { Options } from "../types";
import { useSignMessage } from "wagmi";
import { exceptionHandler } from "../utils/exception";
import { isMainnet, isMainnetio } from "../utils";

const url = "/airdropapi/grant/check-eligibility";

// const url = isMainnet()
//   ? "https://event-api.mindnetwork.xyz/grant/check-eligibility"
//   : isMainnetio()
//   ? "https://grant-api.mindnetwork.io/grant/check-eligibility"
//   : "/grant/check-eligibility";

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
