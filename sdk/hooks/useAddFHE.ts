import { useRequest } from "ahooks";
import { Options } from "../types";
import { watchAsset } from "wagmi/actions";
import { config } from "../wagimConfig";
import { DAOKEN_ADDRESS } from "../blockChain/address";
import { exceptionHandler } from "../utils/exception";
import { useAccount } from "wagmi";
import useValidateChainWalletLink from "./useValidateChainWalletLink";

export default function useFHETokenIntoWallet(options?: Options<any, any>) {
  const { validateAsync, address, chainId } = useValidateChainWalletLink();

  const result = useRequest(
    async () => {
      const isValid = await validateAsync?.();

      if (!isValid || !chainId) {
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
