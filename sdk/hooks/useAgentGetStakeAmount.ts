import { useRequest } from "ahooks";
import { Options } from "../types";
import { readContract } from "wagmi/actions";
import { config } from "../wagimConfig";
import { AGENT1_ABI } from "../blockChain/abi";
import { AGENT1_ADDRESS } from "../blockChain/address";

export default function useAgentGetStakeAmount(options?: Options<unknown, []> & { tokenId?: BigInt }) {
  const { tokenId, ...rest } = options || {};

  const result = useRequest(
    async () => {
      if (!tokenId || tokenId === BigInt(0)) {
        return;
      }

      const amount = (await readContract(config, {
        abi: AGENT1_ABI,
        address: AGENT1_ADDRESS.address,
        functionName: "stakeAmount",
        args: [tokenId],
      })) as bigint;
      return amount;
    },
    {
      refreshDeps: [tokenId],
      ...rest,
    }
  );

  return result;
}
