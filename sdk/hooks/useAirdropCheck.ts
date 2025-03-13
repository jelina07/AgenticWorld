import { useRequest } from "ahooks";
import request from "../request";
import { Options } from "../types";

export default function useAirdropCheck(options?: Options<unknown, [string]>) {
  const result = useRequest(
    async (wallet) => {
      const res = await request.get("/grant/check-eligibility", {
        params: { wallet },
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
