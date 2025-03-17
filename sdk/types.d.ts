export { type Options } from "ahooks/lib/useRequest/src/types";
import { type WaitForTransactionReceiptReturnType } from "wagmi/actions";

export type WriteConractHooksReturnType = undefined | `0x${string}` | WaitForTransactionReceiptReturnType;
