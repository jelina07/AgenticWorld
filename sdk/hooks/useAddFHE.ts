import { useRequest } from "ahooks";
import { Options } from "../types";
import { watchAsset } from "wagmi/actions";
import { config } from "../wagimConfig";
import { DAOKEN_ADDRESS } from "../blockChain/address";
import { exceptionHandler } from "../utils/exception";
import { useAccount } from "wagmi";

export default function useFHETokenIntoWallet(options?: Options<any, any>) {
  const { chainId } = useAccount();
  const result = useRequest(
    async () => {
      if (!chainId) {
        return;
      }
      const isAddToken = await watchAsset(config, {
        type: "ERC20",
        options: {
          address: DAOKEN_ADDRESS[chainId],
          symbol: "FHE",
          decimals: 18,
        },
      });
      return isAddToken;
    },
    {
      manual: true,
      onError: (err) => exceptionHandler(err),
      ...options,
    }
  );
  return result;
}
