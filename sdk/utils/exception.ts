import { notification } from "antd";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function exceptionHandler(error: any, message?: string, description?: string) {
  console.log("🚀 ~ exceptionHandler ~ message:", error);
  // console.log('error?.cause?.walk()', error?.cause?.walk());

  notification.error({
    message: "Error",
    description:
      // description || error?.cause?.walk()?.message || error?.shortMessage || 'Unknown Error',
      description || error?.shortMessage || error?.message || "Unknown Error",
    duration: 5,
  });
}
