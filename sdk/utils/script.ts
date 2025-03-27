import { Abi, decodeErrorResult, encodeFunctionData, parseEther } from "viem";
import { DAOTOKEN_ABI } from "../blockChain/abi";
import { AGENT1_ADDRESS } from "../blockChain/address";
import { estimateGas } from "wagmi/actions";
import { config, supportChainId } from "../wagimConfig";

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

export function decodeErrorData(contractABI: any, data?: `0x${string}`) {
  if (!data) {
    return "Unknown Error";
  } else {
    try {
      const result = decodeErrorResult({
        abi: contractABI,
        data,
      });
      return result.args[1];
    } catch (e) {
      return "Unknown Error";
    }
  }
}

export const Agent1ContractErrorCode = (code: number) => {
  switch (code) {
    case 4001:
      return "Less than minimum amount";
    case 4002:
      return "try to mint more than agentLimitPerUser";
    case 4003:
      return "Not agent owner";
    case 4004:
      return "Not agent owner";
    case 4005:
      return "cannot delegate to more than 1 hub";
    case 4006:
      return "signature expired";
    case 4007:
      return "invalid signature signer";
    case 40019:
      return "cannot delegate due to less than minimum amount";
    case 4008:
      return "Not agent owner";
    case 4009:
      return "unable to exit hub because not in any hub";
    case 40010:
      return "unable to exit hub because not enough training period";
    case 40011:
      return "Not agent owner";
    case 40012:
      return "amount is 0";
    case 40013:
      return "unable to unstake because remaining amount is less than minimum amount";
    case 40014:
      return "unable to unstake because not enough training period";
    case 40015:
      return "Not agent owner";
    case 40016:
      return "unable to withdraw because of lock period";
    case 40017:
      return "already withdraw";
    default:
      return "Unknown Error";
  }
};
export const isSupportChain = (chainid: number) => {
  return supportChainId.includes(chainid);
};

export const faucetError = (data?: string) => {
  switch (data) {
    case "0x82b42900":
      return "Unauthorized";
    case "0x9667e17a":
      return "ArrayLengthMismatch";
    case "0x4991b1e5":
      return "ZeroValueCheck";
    case "0x3d2bfe2c":
      return "ExceededMax";
    case "0x9d70e64a":
      return "RateLimit";
    default:
      return "Unknown Error";
  }
};
