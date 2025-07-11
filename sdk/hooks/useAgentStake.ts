import { useRequest } from "ahooks";
import { Options } from "../types";
import { useWriteContract } from "wagmi";
import { exceptionHandler } from "../utils/exception";
import { isDev, isProd } from "../utils";
import { mindnet, mindtestnet } from "../wagimConfig";
import useValidateChainWalletLink from "./useValidateChainWalletLink";
import { AGENT1_ABI, DAOTOKEN_ABI } from "../blockChain/abi";
import { AGENT1_ADDRESS, DAOKEN_ADDRESS } from "../blockChain/address";
import {
  estimateGas,
  readContract,
  waitForTransactionReceipt,
} from "wagmi/actions";
import { config } from "../wagimConfig";
import { encodeFunctionData, parseEther, parseGwei } from "viem";
import { estimateGasUtil } from "../utils/script";

export default function useAgentStake(
  options?: Options<unknown, [number, string]> & { waitForReceipt?: boolean }
) {
  const { validateAsync, chainId, address } = useValidateChainWalletLink();
  const { writeContractAsync } = useWriteContract();

  const result = useRequest(
    async (tokenId, amount) => {
      const isValid = await validateAsync?.();
      if (!isValid || !chainId) {
        return;
      }
      console.log("address", address);

      const currentAllowance = (await readContract(config, {
        abi: DAOTOKEN_ABI,
        functionName: "allowance",
        address: DAOKEN_ADDRESS[chainId],
        args: [address, AGENT1_ADDRESS[chainId]],
      })) as bigint;
      console.log("currentAllowance", currentAllowance);

      if (parseEther(amount) > currentAllowance) {
        //approve token
        const gasEstimate = await estimateGasUtil(
          DAOTOKEN_ABI,
          "approve",
          [AGENT1_ADDRESS[chainId], parseEther(amount)],
          DAOKEN_ADDRESS[chainId]
        );
        const txHash = await writeContractAsync({
          abi: DAOTOKEN_ABI,
          functionName: "approve",
          address: DAOKEN_ADDRESS[chainId],
          args: [AGENT1_ADDRESS[chainId], parseEther(amount)],
          gas: gasEstimate! + gasEstimate! / BigInt(3),
        });
        await waitForTransactionReceipt(config, { hash: txHash! });
      }

      //stake
      const gasEstimate2 = await estimateGasUtil(
        AGENT1_ABI,
        "stake",
        [tokenId, parseEther(amount)],
        AGENT1_ADDRESS[chainId]
      );
      console.log("stake gasEstimate", gasEstimate2);
      const txHash2 = await writeContractAsync({
        abi: AGENT1_ABI,
        functionName: "stake",
        address: AGENT1_ADDRESS[chainId],
        args: [tokenId, parseEther(amount)],
        gas: gasEstimate2 + gasEstimate2 / BigInt(3),
      });

      if (!options?.waitForReceipt) {
        return txHash2;
      }
      const receipt = await waitForTransactionReceipt(config, {
        hash: txHash2,
      });

      return receipt;
    },
    {
      manual: true,
      onError: (err) => exceptionHandler(err, "agent", AGENT1_ABI, true),
      ...options,
    }
  );

  return result;
}
