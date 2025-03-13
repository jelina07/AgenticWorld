import { useRequest } from "ahooks";
import request from "../request";
import { Options } from "../types";

export default function useAirdropRelayerClaim(options?: Options<unknown, [string]>) {
  const result = useRequest(
    async (wallet) => {
      const res = await request.post("/grant/claim", {
        wallet,
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
