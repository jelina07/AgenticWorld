import { useRequest } from "ahooks";
import request from "../request";
import { Options } from "../types";
import useValidateChainWalletLink from "./useValidateChainWalletLink";
import { isDev, isMainnet, isMainnetio, isProd } from "../utils";
import { mindnet, mindtestnet } from "../wagimConfig";
import { exceptionHandler } from "../utils/exception";
import { useSignMessage } from "wagmi";

const url = isMainnet()
  ? "https://agent.mindnetwork.xyz/airdropapi/grant/early_bird/claim"
  : "/grant/early_bird/claim";

export default function useEarlyBirdAirdropRelayerClaim(
  options?: Options<any, any>
) {
  const { signMessageAsync } = useSignMessage();
  const { validateAsync, chainId, address } = useValidateChainWalletLink(
    isDev() || isProd() ? mindtestnet.id : mindnet.id
  );
  const result = useRequest(
    async () => {
      const isValid = await validateAsync?.();
      if (!isValid || !address || !chainId) {
        return;
      }
      const signature = await signMessageAsync?.({
        message: "Confirm your $FHE claim.",
      });

      const type =
        chainId === mindnet.id || chainId === mindtestnet.id
          ? "MindChain"
          : "BSC";

      const res = await request.post(url, {
        wallet: address,
        signature,
        type,
      });
      console.log(
        "useEarlyBirdAirdropRelayerClaim",
        useEarlyBirdAirdropRelayerClaim
      );

      return res;
    },
    {
      manual: true,
      ...options,
    }
  );

  return result;
}
