import { useRequest } from "ahooks";
import { Options } from "../types";
import { useAccount } from "wagmi";
import { exceptionHandler } from "../utils/exception";
import { readContract } from "wagmi/actions";
import { config } from "../wagimConfig";
import { AGENT1_ABI } from "../blockChain/abi";
import { AGENT1_ADDRESS } from "../blockChain/address";
import { isSupportChain } from "../utils/script";
import { timestampToUTC } from "@/utils/utils";

export default function useAgentUnlock(options?: Options<any, any>) {
  const { address, chainId } = useAccount();
  const result = useRequest(
    async (agentId) => {
      if (!address || !chainId || !isSupportChain(chainId)) {
        return;
      }
      const agentUnlock = (await readContract(config, {
        abi: AGENT1_ABI,
        address: AGENT1_ADDRESS[chainId],
        functionName: "agentUnlock",
        args: [agentId],
      })) as BigInt;

      return Number(agentUnlock);
    },
    {
      manual: true,
      onError: (err) => exceptionHandler(err, "agent", AGENT1_ABI, true),
      ...options,
    }
  );

  return result;
}
