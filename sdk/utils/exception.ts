import { notification } from "antd";
import { Abi, decodeErrorResult } from "viem";
import {
  Agent1ContractErrorCode,
  AirdropContractErrorCode,
  decodeErrorData,
  WorldHealthErrorCode,
} from "./script";

//Differential Contracts ：airdrop, DAO_INSPECTOR_ADDRESS,DAOKEN_ADDRESS
export function exceptionHandler(
  error: any,
  errorType?: string,
  abi?: any,
  isAgentStake?: boolean,
  description?: string
) {
  console.log("exceptionHandler", error);

  if (abi && errorType === "agent") {
    const errorCode = decodeErrorData(abi, error?.cause?.cause?.data);
    const errorMessage = (
      typeof errorCode === "number"
        ? Agent1ContractErrorCode(errorCode)
        : errorCode
    ) as string;
    console.log("agent errorCode errorMessage", errorCode, errorMessage);
    if (
      error?.shortMessage?.toLowerCase().includes("user rejected") ||
      error?.message?.toLowerCase().includes("user rejected")
    ) {
      notification.error({
        message: "Error",
        description: description || error?.shortMessage || error?.message,
        duration: 5,
      });
      if (isAgentStake) {
        console.log("error", error);
        throw new Error(error);
      }
    } else {
      notification.warning({
        message: "Warning",
        description:
          errorMessage || description || error?.shortMessage || error?.message,
        duration: 5,
      });
    }
  } else if (abi && errorType === "facuet") {
    const errorData = error?.cause?.cause?.data;
    const decoded = decodeErrorResult({
      abi: abi,
      data: errorData,
    });
    if (
      error?.shortMessage?.toLowerCase().includes("user rejected") ||
      error?.message?.toLowerCase().includes("user rejected")
    ) {
      notification.error({
        message: "Error",
        description: description || error?.shortMessage || error?.message,
        duration: 5,
      });
    } else {
      notification.warning({
        message: "Warning",
        description:
          decoded.errorName ||
          description ||
          error?.shortMessage ||
          error?.message,
        duration: 5,
      });
    }
  } else if (abi && errorType === "airdrop") {
    const errorCode = decodeErrorData(abi, error?.cause?.cause?.data);
    const errorMessage = (
      typeof errorCode === "number"
        ? AirdropContractErrorCode(errorCode)
        : errorCode
    ) as string;
    console.log("errorCode", errorCode);
    if (
      error?.shortMessage?.toLowerCase().includes("user rejected") ||
      error?.message?.toLowerCase().includes("user rejected")
    ) {
      notification.error({
        message: "Error",
        description: description || error?.shortMessage || error?.message,
        duration: 5,
      });
    } else {
      notification.warning({
        message: "Warning",
        description:
          errorMessage || description || error?.shortMessage || error?.message,
        duration: 5,
      });
    }
  } else if (abi && errorType === "worldAIHealth") {
    const errorCode = decodeErrorData(abi, error?.cause?.cause?.data);
    const errorMessage = (
      typeof errorCode === "number"
        ? WorldHealthErrorCode(errorCode)
        : errorCode
    ) as string;
    console.log("errorCode", errorCode);
    if (
      error?.shortMessage?.toLowerCase().includes("user rejected") ||
      error?.message?.toLowerCase().includes("user rejected")
    ) {
      notification.error({
        message: "Error",
        description: description || error?.shortMessage || error?.message,
        duration: 5,
      });
    } else {
      notification.warning({
        message: "Warning",
        description:
          errorMessage || description || error?.shortMessage || error?.message,
        duration: 5,
      });
    }
  } else if (errorType === "relayerStake") {
    notification.error({
      message: "Error",
      description:
        description || error?.shortMessage || error?.message || "Unknown Error",
      duration: 5,
    });
    throw new Error(error);
  } else {
    notification.error({
      message: "Error",
      description:
        description || error?.shortMessage || error?.message || "Unknown Error",
      duration: 5,
    });
  }
}
