import { useRequest } from "ahooks";
import { Options } from "../types";
import { readContract } from "wagmi/actions";
import { config } from "../wagimConfig";
import { AGENT1_ABI } from "../blockChain/abi";
import { AGENT1_ADDRESS } from "../blockChain/address";
import { formatEther } from "viem";
import { exceptionHandler } from "../utils/exception";

export default function useAgentGetStakeAmount(
  options?: Options<string | undefined, []> & { tokenId?: number }
) {
  const { tokenId, ...rest } = options || {};

  const result = useRequest(
    async () => {
      if (!tokenId) {
        return;
      }
      const amount = (await readContract(config, {
        abi: AGENT1_ABI,
        address: AGENT1_ADDRESS.address,
        functionName: "stakeAmount",
        args: [tokenId],
      })) as bigint;
      return formatEther(amount);
    },
    {
      onError: (err) => exceptionHandler(err),
      refreshDeps: [tokenId],
      ...rest,
    }
  );

  return result;
}
