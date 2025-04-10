import { isDev, isProd } from "@/sdk/utils";
import { chains, mindnet, mindtestnet } from "@/sdk/wagimConfig";
import { message } from "antd";
import millify from "millify";

export const launchAgent = "Stake & Launch";
export const firstStakeAmount = 10;
export const unstakeAmountThreshold = 100;
export const $FHELockupperiod = 30;
export const cexInfo = [
  {
    value: "Bitget",
    label: "Bitget",
    logo: "/icons/bitget-circle-logo.svg",
    img: "/icons/bitget-logo.svg",
    learnMore:
      "https://docs.google.com/document/d/1YkTTWY3tOsnjjcve44tu-jRMyDq2K0ICCMBQsKPt7fs/mobilebasic#heading=h.8qfw0bt1eobs",
    createAccount: "https://bitget.onelink.me/XqvW?af_xp=custom&pid=PRELSTFHE",
  },
  {
    value: "Gate.io",
    label: "Gate.io",
    logo: "/images/gate-circle-logo.jpeg",
    img: "/icons/gate-logo.svg",
    learnMore: "",
    createAccount: "",
  },
  {
    value: "HASHKEY",
    label: "HASHKEY",
    logo: "/icons/hashkey-circle-logo.svg",
    img: "/icons/hashkey-logo.svg",
    learnMore:
      "https://docs.google.com/document/d/1hq5MFbu5RdcyfsAuRyDU8CKb6b8kien0SytZX4gZeNw/edit?usp=sharing",
    createAccount:
      "https://global.hashkey.com/en-US/register/invite?invite_code=MIND",
  },
  {
    value: "Ourbit",
    label: "Ourbit",
    logo: "/images/ourbit-circle-logo.jpeg",
    img: "/images/ourbit-logo.png",
    learnMore:
      "https://docs.google.com/document/d/10bGKvtXDKOV3OdAZzGOVhQUAjaU-KLps6wSB1_AmpLA/edit?tab=t.0#heading=h.6swp0s2s6ve5",
    createAccount: "",
  },
];
export const getMore$FHE =
  "https://docs.mindnetwork.xyz/minddocs/governance/get-usdfhe";
export const bridgeMindgasLink = "/bridge";
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

export function checkAmountControlButtonShowCan0(amount: string) {
  const amountRegex = /^(0(\.\d{1,50})?|([1-9]\d*)(\.\d{1,50})?)$/;
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

export function judgeUseGasless(chainId?: number) {
  return chainId === mindnet.id || chainId === mindtestnet.id;
}

export function timestampToUTC(timestamp: number) {
  const ts = Number(timestamp);
  const isSeconds = ts.toString().length <= 10;
  const date = new Date(isSeconds ? ts * 1000 : ts);

  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const day = date.getUTCDate();
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = months[date.getUTCMonth()];
  const year = date.getUTCFullYear();

  return `UTC ${hours}:${minutes}, ${month} ${day}, ${year}`;
}
