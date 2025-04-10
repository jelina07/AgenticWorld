//disable
import { useRequest } from "ahooks";
import { Options } from "../types";
import request from "../request";
import { useAccount, useSignMessage } from "wagmi";
import { exceptionHandler } from "../utils/exception";
import { isMainnet, isMainnetio } from "../utils";

const url = isMainnet()
  ? "https://event-api.mindnetwork.xyz/grant/cex/register"
  : isMainnetio()
  ? "https://grant-api.mindnetwork.io/grant/cex/register"
  : "/grant/cex/register";

export default function useAirdropCexRegisterInfo(options?: Options<any, any>) {
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const result = useRequest(
    async () => {
      if (!address) {
        return false;
      }

      const signature = await signMessageAsync?.({
        message: `By signing this message, you confirm that you wish to receive the airdrop through your selected method.`,
      });
      const res = await request.get(url, {
        params: {
          signature,
          wallet: address,
        },
      });

      return res;
    },
    {
      manual: true,
      onError: (err) => exceptionHandler(err),
      refreshDeps: [address],
      ...options,
    }
  );

  return result;
}
