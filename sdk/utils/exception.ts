import { notification } from "antd";
import { Abi, decodeErrorResult } from "viem";
import {
  Agent1ContractErrorCode,
  AirdropContractErrorCode,
  decodeErrorData,
} from "./script";

//Differential Contracts ：airdrop, DAO_INSPECTOR_ADDRESS,DAOKEN_ADDRESS
export function exceptionHandler(
  error: any,
  errorType?: string,
  abi?: any,
  description?: string
) {
  console.log(
    "🚀 ~ exceptionHandler ~ message:",
    error?.cause?.cause?.data || error?.data
  );
  if (abi && errorType === "agent") {
    const errorCode = decodeErrorData(abi, error?.cause?.cause?.data);
    const errorMessage = (
      typeof errorCode === "number"
        ? Agent1ContractErrorCode(errorCode)
        : errorCode
    ) as string;
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
  } else {
    notification.error({
      message: "Error",
      description:
        description || error?.shortMessage || error?.message || "Unknown Error",
      duration: 5,
    });
  }
}
