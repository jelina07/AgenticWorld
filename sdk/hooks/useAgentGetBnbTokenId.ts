import { useRequest } from "ahooks";
import { Options } from "../types";
import { useAccount } from "wagmi";
import { exceptionHandler } from "../utils/exception";
import { readContract } from "wagmi/actions";
import { bnb, bnbtestnet, config, getTransports } from "../wagimConfig";
import { AGENT1_ABI } from "../blockChain/abi";
import { AGENT1_ADDRESS } from "../blockChain/address";
import { isSupportChain } from "../utils/script";
import { createPublicClient } from "viem";
import { isDev, isProd } from "../utils";

const bnbChainId = isDev() || isProd() ? bnbtestnet.id : bnb.id;
const publicClientBsc = createPublicClient({
  batch: {
    multicall: true,
  },
  chain: isDev() || isProd() ? bnbtestnet : bnb,
  transport: getTransports(bnbChainId),
});

export default function useAgentGetBnbTokenId(
  options?: Options<number | undefined, []>
) {
  const { address, chainId } = useAccount();

  const result = useRequest(
    async () => {
      if (!address || !chainId) {
        return;
      }
      const agentCount = (await publicClientBsc.readContract({
        abi: AGENT1_ABI,
        address: AGENT1_ADDRESS[bnbChainId],
        functionName: "balanceOf",
        args: [address],
      })) as BigInt;
      if (agentCount === BigInt(0)) {
        return 0;
      }
      const agentId = (await publicClientBsc.readContract({
        abi: AGENT1_ABI,
        address: AGENT1_ADDRESS[bnbChainId],
        functionName: "tokenOfOwnerByIndex",
        args: [address, 0],
      })) as bigint;
      return Number(agentId);
    },
    {
      refreshDeps: [address],
      onError: (err) => exceptionHandler(err),
      ...options,
    }
  );

  return result;
}
