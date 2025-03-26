import { useRequest } from "ahooks";
import { Options } from "../types";
import { useAccount } from "wagmi";
import { exceptionHandler } from "../utils/exception";
import { readContract } from "wagmi/actions";
import { config } from "../wagimConfig";
import { AGENT1_ABI } from "../blockChain/abi";
import { AGENT1_ADDRESS } from "../blockChain/address";
import useAgentGetTokenIdStore from "@/store/useAgentGetTokenId";
import { isSupportChain } from "../utils/script";

export default function useAgentGetTokenId(
  options?: Options<number | undefined, []>
) {
  const { address, chainId } = useAccount();
  const setAgentTokenId = useAgentGetTokenIdStore(
    (state) => state.setAgentTokenId
  );
  const result = useRequest(
    async () => {
      if (!address || !chainId || !isSupportChain(chainId)) {
        if (setAgentTokenId) setAgentTokenId(0);
        return;
      }
      const agentCount = (await readContract(config, {
        abi: AGENT1_ABI,
        address: AGENT1_ADDRESS[chainId],
        functionName: "balanceOf",
        args: [address],
      })) as BigInt;
      if (agentCount === BigInt(0)) {
        if (setAgentTokenId) setAgentTokenId(0);
        // 表示 还没有stake 过
        return 0;
      }
      const agentId = (await readContract(config, {
        abi: AGENT1_ABI,
        address: AGENT1_ADDRESS[chainId],
        functionName: "tokenOfOwnerByIndex",
        args: [address, 0],
      })) as bigint;
      if (setAgentTokenId) setAgentTokenId(Number(agentId));
      return Number(agentId);
    },
    {
      refreshDeps: [address, chainId],
      onError: (err) => exceptionHandler(err),
      ...options,
    }
  );

  return result;
}
