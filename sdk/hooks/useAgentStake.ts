import { useRequest } from "ahooks";
import { Options } from "../types";
import { useWriteContract } from "wagmi";
import { exceptionHandler } from "../utils/exception";
import { isDev } from "../utils";
import { mindnet, mindtestnet } from "../wagimConfig";
import useValidateChainWalletLink from "./useValidateChainWalletLink";
import { AGENT1_ABI, DAOTOKEN_ABI } from "../blockChain/abi";
import { AGENT1_ADDRESS, DAOKEN_ADDRESS } from "../blockChain/address";
import { waitForTransactionReceipt } from "wagmi/actions";
import { config } from "../wagimConfig";

export default function useAgentStake(options?: Options<unknown, [BigInt, BigInt]> & { waitForReceipt?: boolean }) {
  const { validateAsync } = useValidateChainWalletLink(isDev() ? mindtestnet.id : mindnet.id);
  const { writeContractAsync } = useWriteContract();

  const result = useRequest(
    async (tokenId: BigInt, amount: BigInt) => {
      const isValid = await validateAsync?.();
      if (!isValid) {
        return;
      }
      //approve
      const txHash = await writeContractAsync({
        abi: DAOTOKEN_ABI,
        functionName: "approve",
        address: DAOKEN_ADDRESS.address,
        args: [AGENT1_ADDRESS.address, amount],
      });
      //等待出块
      await waitForTransactionReceipt(config, { hash: txHash });
      //stake
      const txHash2 = await writeContractAsync({
        abi: AGENT1_ABI,
        functionName: "stake",
        address: AGENT1_ADDRESS.address,
        args: [tokenId, amount],
      });
      if (!options?.waitForReceipt) {
        return txHash2;
      }
      const receipt = await waitForTransactionReceipt(config, { hash: txHash2 });
      console.log("🚀 ~ receipt:", receipt);
      return receipt;
    },
    {
      manual: true,
      onError: (err) => exceptionHandler(err),
      ...options,
    }
  );

  return result;
}
