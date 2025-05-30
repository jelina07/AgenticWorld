import { useRequest } from "ahooks";
import { Options } from "../../types";
import { watchAsset } from "wagmi/actions";
import { config } from "../../wagimConfig";
import { DAOKEN_ADDRESS } from "../../blockChain/address";
import { exceptionHandler } from "../../utils/exception";
import { useAccount } from "wagmi";

export default function useEncryptData(options?: Options<any, any>) {
  const { chainId } = useAccount();
  const result = useRequest(
    async () => {
      if (!chainId) {
        return;
      }
      //   const amount = (await readContract(config, {
      //     abi: AGENT1_ABI,
      //     address: AGENT1_ADDRESS[chainId],
      //     functionName: "stakeAmount",
      //     args: [tokenId],
      //   })) as bigint;

      //   return amount;
    },
    {
      manual: true,
      onError: (err) => exceptionHandler(err),
      ...options,
    }
  );
  return result;
}
