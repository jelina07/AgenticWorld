import { useRequest } from "ahooks";
import request from "../request";
import { Options } from "../types";
import { useAccount, useSignMessage } from "wagmi";
import { exceptionHandler } from "../utils/exception";
import { isMainnet, isMainnetio, isProd } from "../utils";
import { isSupportChain } from "../utils/script";
import { mindnet, mindtestnet } from "../wagimConfig";

const url = isMainnet()
  ? "https://agent.mindnetwork.xyz/airdropapi/grant/early-bird/check"
  : isMainnetio()
  ? "https://agent.mindnetwork.io/airdropapi/grant/early-bird/check"
  : "/grant/early-bird/check";

export default function useEarlyBirdAirdropCheck(
  options?: Options<any, [string]>
) {
  const { address: wallet, chainId } = useAccount();
  const result = useRequest(
    async () => {
      if (!wallet || !chainId || !isSupportChain(chainId)) {
        return;
      }
      const paramsChain =
        chainId === mindnet.id || chainId === mindtestnet.id
          ? "MindChain"
          : "BSC";
      const res = await request.get(url, {
        params: { wallet, chainId: paramsChain },
      });
      return res;
    },
    {
      onError: (err) => exceptionHandler(err),
      refreshDeps: [wallet, chainId],
      ...options,
    }
  );

  return result;
}
