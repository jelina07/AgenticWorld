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
      console.log("decodeErrorResult");
      const result = decodeErrorResult({
        abi: contractABI,
        data,
      });
      console.log("decodeErrorData", result, result.errorName);
      return result.args[1];
    } catch (e) {
      console.log("decodeErrorDataError", e);
      return "Unknown Error";
    }
  }
}

export const Agent1ContractErrorCode = (code: number) => {
  switch (code) {
    case 4001:
      return "Less than minimum amount";
    case 4002:
      return "Try to mint more than agentLimitPerUser";
    case 4003:
      return "Not agent owner";
    case 4004:
      return "Not agent owner";
    case 4005:
      return "Cannot delegate to more than 1 hub";
    case 4006:
      return "Signature expired";
    case 4007:
      return "Invalid signature signer";
    case 4008:
      return "Not agent owner";
    case 4009:
      return "Unable to exit hub because not in any hub";
    case 40010:
      return "Unable to exit hub because not enough training period";
    case 40011:
      return "Not agent owner";
    case 40012:
      return "Amount is 0";
    case 40013:
      return "Unable to unstake because remaining amount is less than minimum amount";
    case 40014:
      return "Unable to unstake because not enough training period";
    case 40015:
      return "Not agent owner";
    case 40016:
      return "Unable to withdraw because of lock period";
    case 40017:
      return "Already withdraw";
    case 40019:
      return "Cannot delegate due to less than minimum amount";
    case 40022:
      return "You can only unstake after the lock-up period ends";
    case 40023:
      return "You can only withdraw and shut down your agent after the lock-up period ends";
    case 40024:
      return "You can only redeem your rewards after the lock-up period ends";
    default:
      return "Unknown Error";
  }
};
export const AirdropContractErrorCode = (code: number) => {
  switch (code) {
    case 410:
      return "It has already been claimed.";
    case 403:
      return "Proof error";
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

export const WorldHealthErrorCode = (code: number) => {
  switch (code) {
    case 4001:
      return "no agent";
    case 4002:
      return "Repeat the existing content";
    case 4003:
      return "have voted";
    default:
      return "Unknown Error";
  }
};
