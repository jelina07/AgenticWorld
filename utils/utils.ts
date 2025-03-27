import { isDev, isProd } from "@/sdk/utils";
import { chains } from "@/sdk/wagimConfig";
import { message } from "antd";
import millify from "millify";

export const firstStakeAmount = isDev() || isProd() ? 100 : 0;

export function scan(address: `0x${string}`, currentChainid: number) {
  console.log(
    "chains.find((item: any) => item.id === currentChainid)",
    chains.find((item: any) => item.id === currentChainid)
  );

  return (
    chains.find((item: any) => item.id === currentChainid).blockExplorers
      .default.url +
    "/address/" +
    address
  );
}

export function handleCopy(textToCopy: string) {
  navigator.clipboard
    .writeText(textToCopy)
    .then(() => {
      message.open({
        type: "success",
        content: "Copy Success !",
        duration: 5,
      });
    })
    .catch((err) => {
      message.open({
        type: "warning",
        content: "Copy failed, please retry !",
        duration: 5,
      });
    });
}

export function checkAmountControlButtonShow(amount: string) {
  const amountRegex = /^(?=.*[1-9])(?!0\d)\d+(\.\d{1,50})?$/;
  const response = amountRegex.test(amount);
  if (!response) {
    message.open({
      type: "warning",
      content: "Please enter the correct amount !",
      duration: 5,
    });
    return false;
  } else {
    return true;
  }
}

export function numberDigits(showItem: string | number) {
  if (Number.isNaN(Number(showItem)) || !Number.isFinite(Number(showItem)))
    return "";
  else {
    const formattedNum = millify(Number(showItem), {
      precision: 4,
      locales: "en-US",
    });
    return formattedNum;
  }
}

export function number5Digits(showItem: string | number) {
  if (Number.isNaN(Number(showItem)) || !Number.isFinite(Number(showItem)))
    return "";
  else {
    const formattedNum = millify(Number(showItem), {
      precision: 5,
      locales: "en-US",
    });

    return formattedNum;
  }
}

export function numberDigitsNoMillify(showItem: string | number) {
  const formattedNum = Number(showItem).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
    useGrouping: true,
  });
  return formattedNum;
}

export function secondsToHours(seconds: number | string): string {
  if (isNaN(Number(seconds))) return seconds as string;
  return numberDigitsNoMillify(Number(seconds) / 3600);
}

export function getUserAgent() {
  if (typeof window === "undefined") return "";
  return window.navigator.userAgent;
}
