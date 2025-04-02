import { notification } from "antd";
import { Abi, decodeErrorResult } from "viem";
import {
  Agent1ContractErrorCode,
  decodeErrorData,
  faucetError,
} from "./script";

//Differential Contracts ：airdrop, DAO_INSPECTOR_ADDRESS,DAOKEN_ADDRESS
export function exceptionHandler(
  error: any,
  abi?: any,
  isAgent?: boolean,
  isFacuetError?: boolean,
  description?: string
) {
  console.log(
    "🚀 ~ exceptionHandler ~ message:",
    error?.cause?.cause?.data || error?.data
  );
  if (abi && isAgent) {
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
  } else if (abi && isFacuetError) {
    const errorData = error?.cause?.cause?.data;
    console.log("errorData", errorData);

    const decoded = decodeErrorResult({
      abi: abi,
      data: errorData,
    });
    console.log("facuetError", decoded);
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
  } else {
    notification.error({
      message: "Error",
      description:
        description || error?.shortMessage || error?.message || "Unknown Error",
      duration: 5,
    });
  }
}
