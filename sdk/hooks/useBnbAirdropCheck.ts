import { useRequest } from "ahooks";
import request from "../request";
import { Options } from "../types";
import { useSignMessage } from "wagmi";
import { exceptionHandler } from "../utils/exception";
import { isMainnet, isMainnetio } from "../utils";

const url = isMainnet()
  ? "https://agent.mindnetwork.xyz/airdropapi/grant/bnb_launch/check-eligibility"
  : isMainnetio()
  ? "https://agent.mindnetwork.io/airdropapi/grant/bnb_launch/check-eligibility"
  : "/grant/bnb_launch/check-eligibility";

export default function useBnbAirdropCheck(options?: Options<any, [string]>) {
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
