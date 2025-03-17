import { isDev, isProd } from "@/sdk/utils";
import { message } from "antd";

export const mindscan = (address: `0x${string}`) => {
  return isDev() || isProd()
    ? `https://explorer-testnet.mindnetwork.xyz/address/${address}`
    : `https://explorer.mindnetwork.xyz/address/${address}`;
};

export function handleCopy(textToCopy: string) {
  navigator.clipboard
    .writeText(textToCopy)
    .then(() => {
      message.open({
        type: "success",
        content: "Copy success",
        duration: 5,
      });
    })
    .catch((err) => {
      message.open({
        type: "warning",
        content: "Copy failed, please retry",
        duration: 5,
      });
    });
}
