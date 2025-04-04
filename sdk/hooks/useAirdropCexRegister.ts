import { useRequest } from "ahooks";
import { Options } from "../types";
import request from "../request";
import { useAccount, useSignMessage } from "wagmi";
import { exceptionHandler } from "../utils/exception";

type Payload = {
  cexName: "Bitget" | "Gate.io" | "HASHKEY" | "Ourbit";
  cexAddress: string;
  cexUuid: string;
};

export default function useAirdropCexRegister(
  options?: Options<unknown, [Payload]>
) {
  const { signMessageAsync } = useSignMessage();

  const { address } = useAccount();

  const result = useRequest(
    async (data) => {
      console.log("data", data);

      const signature = await signMessageAsync?.({
        message: `Sign to confirm claiming the airdrop to ${data.cexName}.`,
      });

      const res = await request.post("/grant/cex/register", {
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
