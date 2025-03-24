import { notification } from "antd";
import { Abi, decodeErrorResult } from "viem";
import { Agent1ContractErrorCode, decodeErrorData } from "./script";

//Differential Contracts ：airdrop, DAO_INSPECTOR_ADDRESS,DAOKEN_ADDRESS
export function exceptionHandler(error: any, abi?: any, description?: string) {
  console.log(
    "🚀 ~ exceptionHandler ~ message:",
    error?.cause?.cause?.data || error?.data
  );
  if (abi) {
    const errorCode = decodeErrorData(abi, error?.cause?.cause?.data);
    const errorMessage = (
      typeof errorCode === "number"
        ? Agent1ContractErrorCode(errorCode)
        : errorCode
    ) as string;
    console.log("errorMessage", errorCode, errorMessage);
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
      notification.error({
        message: "Error",
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
