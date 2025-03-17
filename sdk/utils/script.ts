import { encodeFunctionData, parseEther } from "viem";
import { DAOTOKEN_ABI } from "../blockChain/abi";
import { AGENT1_ADDRESS } from "../blockChain/address";
import { estimateGas } from "wagmi/actions";
import { config } from "../wagimConfig";

export const estimateGasUtil = async (
  abi: any[],
  functionName: string,
  args: any[],
  gasEstimateTo: `0x${string}`
) => {
  const data = encodeFunctionData({
    abi,
    functionName,
    args,
  });

  const gasEstimate = await estimateGas(config, {
    to: gasEstimateTo,
    data,
  });

  return gasEstimate;
};
