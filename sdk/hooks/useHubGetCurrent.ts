import { useRequest } from "ahooks";
import { Options } from "../types";
import { readContract } from "wagmi/actions";
import { config } from "../wagimConfig";
import { AGENT1_ABI } from "../blockChain/abi";
import { AGENT1_ADDRESS } from "../blockChain/address";

export default function useHubGetCurrent(options?: Options<number | undefined, []> & { tokenId?: number }) {
  const result = useRequest(
    async () => {
      if (!options?.tokenId) {
        return;
      }
      const currentHub = (await readContract(config, {
        abi: AGENT1_ABI,
        address: AGENT1_ADDRESS.address,
        functionName: "currentHub",
        args: [options.tokenId],
      })) as bigint;

      return Number(currentHub);
    },
    {
      refreshDeps: [options?.tokenId],
      ...options,
    }
  );

  return result;
}
