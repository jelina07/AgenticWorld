import { useRequest } from "ahooks";
import { Options } from "../types";
import { readContract } from "wagmi/actions";
import { config } from "../wagimConfig";
import { AGENT1_ABI } from "../blockChain/abi";
import { AGENT1_ADDRESS } from "../blockChain/address";
import useGetLearningHubId from "@/store/useGetLearningHubId";
import { exceptionHandler } from "../utils/exception";
import { useAccount } from "wagmi";
import { isSupportChain } from "../utils/script";

export default function useHubGetCurrent(
  options?: Options<number | undefined, []> & { tokenId?: number }
) {
  const { setLearningHubId } = useGetLearningHubId();
  const { chainId } = useAccount();
  const result = useRequest(
    async () => {
      if (!options?.tokenId || !chainId || !isSupportChain(chainId)) {
        setLearningHubId(0);
        return;
      }
      const currentHub = (await readContract(config, {
        abi: AGENT1_ABI,
        address: AGENT1_ADDRESS[chainId],
        functionName: "currentHub",
        args: [options.tokenId],
      })) as bigint;
      setLearningHubId(Number(currentHub));
      return Number(currentHub);
    },
    {
      onError: (err) => exceptionHandler(err),
      refreshDeps: [options?.tokenId, chainId],
      ...options,
    }
  );

  return result;
}
