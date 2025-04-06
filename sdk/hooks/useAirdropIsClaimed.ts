import { useRequest } from "ahooks";
import { Options } from "../types";
import { useAccount } from "wagmi";
import { exceptionHandler } from "../utils/exception";
import { readContract } from "wagmi/actions";
import {
  bnb,
  bnbtestnet,
  config,
  getTransports,
  mindnet,
  mindtestnet,
} from "../wagimConfig";
import { AIRDROP_ABI } from "../blockChain/abi";

import { isSupportChain } from "../utils/script";
import { AIRDROP_ADDRESS } from "../blockChain/address";
import { createPublicClient } from "viem";
import { isDev, isProd } from "../utils";

const publicClientMind = createPublicClient({
  batch: {
    multicall: true,
  },
  chain: isDev() || isProd() ? mindtestnet : mindnet,
  transport:
    isDev() || isProd()
      ? getTransports(mindtestnet.id)
      : getTransports(mindnet.id),
});
const publicClientBsc = createPublicClient({
  batch: {
    multicall: true,
  },
  chain: isDev() || isProd() ? bnbtestnet : bnb,
  transport:
    isDev() || isProd() ? getTransports(bnbtestnet.id) : getTransports(bnb.id),
});

export default function useAirdropIsClaimed(options?: Options<any, any>) {
  const { address, chainId } = useAccount();

  const result = useRequest(
    async (claimChain) => {
      if (!address || !chainId || !isSupportChain(chainId)) {
        return;
      }
      const publicClient =
        claimChain === "MindChain" ? publicClientMind : publicClientBsc;
      const res = (await publicClient.readContract({
        abi: AIRDROP_ABI,
        address: AIRDROP_ADDRESS[chainId],
        functionName: "claimed",
        args: [address],
      })) as boolean;
      return res;
    },
    {
      onError: (err) => exceptionHandler(err),
      refreshDeps: [address, chainId],
      manual: true,
      ...options,
    }
  );

  return result;
}
