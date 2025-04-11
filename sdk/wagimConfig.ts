import "@rainbow-me/rainbowkit/styles.css";

import { Chain, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { isDev, isMainnet, isMainnetio, isProd } from "./utils";
import {
  injectedWallet,
  metaMaskWallet,
  rainbowWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { bsc, bscTestnet } from "viem/chains";
import { fallback, http } from "wagmi";
import { getUserAgent } from "@/utils/utils";
const userAgentBrowser = getUserAgent(); //
const INFURA_ID = "6f7f75dedc2a46669b6373796866b12a"; //testnet
const INFURA_ID_MAINNET = "81cc77112fc44930806b6cb99ab24caf";
const ANKRID =
  "25d7836da278ec26551f9b7297ffea417c87fbb26caffe92ba656ee8e0f391d4";
const NODEREALID = "01355584a3da4d22a34f4b6008e72c08";
import binanceWallet from "@binance/w3w-rainbow-connector-v2";

export const getTransports = (chainId: number) => {
  switch (chainId) {
    case bnb.id:
      return fallback([
        http(`https://bsc-dataseed3.binance.org/`),
        http(`https://rpc.ankr.com/bsc/${ANKRID}`),
      ]);
    case bnbtestnet.id:
      return fallback([
        http(`https://bsc-testnet.infura.io/v3/${INFURA_ID}`),
        http(`https://rpc.ankr.com/bsc_testnet_chapel/${ANKRID}`),
      ]);
    case mindtestnet.id:
      return http("https://rpc-testnet.mindnetwork.xyz");
    case mindnet.id:
      return fallback([
        http(`https://rpc.mindnetwork.xyz`),
        http(`https://rpc-mainnet.mindnetwork.xyz`),
      ]);
    default:
      throw new Error("Unsupported chain");
  }
};
export const mindtestnet = {
  id: 192940,
  name: "MindTestChain",
  iconUrl: "/icons/mind-chain.svg",
  iconBackground: "#fff",
  nativeCurrency: { name: "mind native token", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc-testnet.mindnetwork.xyz"] },
  },
  blockExplorers: {
    default: {
      name: "MindChain Explorer",
      url: "https://explorer-testnet.mindnetwork.xyz",
    },
  },
  testnet: true,
} as const satisfies Chain;

export const mindnet = {
  id: 228,
  name: "MindChain",
  iconUrl: "/icons/mind-chain.svg",
  iconBackground: "#fff",
  nativeCurrency: { name: "mind native token", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc-mainnet.mindnetwork.xyz"] },
  },
  blockExplorers: {
    default: {
      name: "MindChain Explorer",
      url: "https://explorer.mindnetwork.xyz",
    },
  },
} as const satisfies Chain;

const bnbtestnet = {
  ...bscTestnet,
  name: "BNB Smart Chain Testnet",
  iconUrl: "/images/bnb.png",
  iconBackground: "#fff",
};
const bnb = {
  ...bsc,
  name: "BNB Smart Chain",
  rpcUrls: {
    default: { http: ["https://bsc-dataseed.bnbchain.org"] },
  },
  iconUrl: "/images/bnb.png",
  iconBackground: "#fff",
};

let chains: any = [];
if ((isDev() || isProd()) && userAgentBrowser.includes("BNC")) {
  chains = [{ ...bnbtestnet }];
} else if (isDev() || (isProd() && !userAgentBrowser.includes("BNC"))) {
  chains = [mindtestnet, { ...bnbtestnet }];
} else if ((isMainnet() || isMainnetio()) && userAgentBrowser.includes("BNC")) {
  chains = [{ ...bnb }];
} else if (
  (isMainnet() || isMainnetio()) &&
  !userAgentBrowser.includes("BNC")
) {
  chains = [mindnet, { ...bnb }];
} else {
  chains = [];
}

export const config = getDefaultConfig({
  appName: "mind agent dapp",
  projectId: "caf8ddb78ed05799b8f45153c6837c94",
  wallets: [
    {
      groupName: "Recommended",
      wallets: [
        binanceWallet,
        walletConnectWallet,
        rainbowWallet,
        metaMaskWallet,
      ],
    },
    {
      groupName: "Others",
      wallets: [injectedWallet],
    },
  ],
  chains: chains,
  ssr: true, // If your dApp uses server side rendering (SSR)
  transports: {
    [bnbtestnet.id]: getTransports(bnbtestnet.id),
    [bnb.id]: getTransports(bnb.id),
    [mindtestnet.id]: getTransports(mindtestnet.id),
    [mindnet.id]: getTransports(mindnet.id),
  },
});

export const supportChainId =
  chains.length === 0 ? [] : chains.map((item: any) => item.id);
export { chains, bnbtestnet, bnb };
