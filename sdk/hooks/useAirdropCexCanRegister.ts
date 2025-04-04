import { useRequest } from "ahooks";
import { Options } from "../types";
import request from "../request";
import { useAccount } from "wagmi";
import { exceptionHandler } from "../utils/exception";

export default function useAirdropCexCanRegister(options?: Options<any, any>) {
  const { address } = useAccount();

  const result = useRequest(
    async () => {
      if (!address) {
        return false;
      }
      console.log("useAirdropCexCanRegister");

      const res = await request.get("/grant/cex/register", {
        params: {
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
