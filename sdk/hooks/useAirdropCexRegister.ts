import { useRequest } from "ahooks";
import { Options } from "../types";
import request from "../request";
import { useAccount, useSignMessage } from "wagmi";
import { exceptionHandler } from "../utils/exception";
import { isDev, isMainnet, isMainnetio } from "../utils";

type Payload = {
  cexName: "Bitget" | "Gate.io" | "HASHKEY" | "Ourbit" | "MindChain";
  cexAddress: string;
  cexUuid: string;
};
const url = isMainnet()
  ? "https://agent.mindnetwork.xyz/airdropapi/grant/cex/register"
  : "/grant/cex/register";

// const url = isMainnet()
//   ? "https://event-api.mindnetwork.xyz/grant/cex/register"
//   : isMainnetio()
//   ? "https://grant-api.mindnetwork.io/grant/cex/register"
//   : "/grant/cex/register";

export default function useAirdropCexRegister(
  options?: Options<unknown, [Payload]>
) {
  const { signMessageAsync } = useSignMessage();

  const { address } = useAccount();

  const result = useRequest(
    async (data) => {
      const signature = await signMessageAsync?.({
        message: `Sign to confirm claiming the airdrop to ${data.cexName}.`,
      });

      const res = await request.post(url, {
        ...data,
        walletAddress: address,
        signature,
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
