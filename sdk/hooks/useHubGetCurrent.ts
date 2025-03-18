import { useRequest } from "ahooks";
import { Options } from "../types";
import { readContract } from "wagmi/actions";
import { config } from "../wagimConfig";
import { AGENT1_ABI } from "../blockChain/abi";
import { AGENT1_ADDRESS } from "../blockChain/address";
import useGetLearningHubId from "@/store/useGetLearningHubId";

export default function useHubGetCurrent(
  options?: Options<number | undefined, []> & { tokenId?: number }
) {
  const { setLearningHubId } = useGetLearningHubId();
  const result = useRequest(
    async () => {
      if (!options?.tokenId) {
        setLearningHubId(0);
        return;
      }
      const currentHub = (await readContract(config, {
        abi: AGENT1_ABI,
        address: AGENT1_ADDRESS.address,
        functionName: "currentHub",
        args: [options.tokenId],
      })) as bigint;
      setLearningHubId(Number(currentHub));
      return Number(currentHub);
    },
    {
      refreshDeps: [options?.tokenId],
      ...options,
    }
  );

  return result;
}
