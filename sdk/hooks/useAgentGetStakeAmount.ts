import { useRequest } from "ahooks";
import { Options } from "../types";
import { readContract } from "wagmi/actions";
import { config } from "../wagimConfig";
import { AGENT1_ABI } from "../blockChain/abi";
import { AGENT1_ADDRESS } from "../blockChain/address";
import { formatEther } from "viem";
import { exceptionHandler } from "../utils/exception";
import { useAccount } from "wagmi";
import { isSupportChain } from "../utils/script";

export default function useAgentGetStakeAmount(
  options?: Options<string | undefined, []> & { tokenId?: number }
) {
  const { tokenId, ...rest } = options || {};
  const { chainId } = useAccount();
  const result = useRequest(
    async () => {
      if (!tokenId || !chainId || !isSupportChain(chainId)) {
        return;
      }
      const amount = (await readContract(config, {
        abi: AGENT1_ABI,
        address: AGENT1_ADDRESS[chainId],
        functionName: "stakeAmount",
        args: [tokenId],
      })) as bigint;
      return formatEther(amount);
    },
    {
      onError: (err) => exceptionHandler(err),
      refreshDeps: [tokenId, chainId],
      ...rest,
    }
  );

  return result;
}
