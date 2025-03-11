import "@rainbow-me/rainbowkit/styles.css";

import { Chain, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { isDev, isProd } from "./utils";
import {
  injectedWallet,
  metaMaskWallet,
  rainbowWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";

export const mindtestnet = {
  id: 192940,
  name: "MindTestChain",
  iconUrl: "/icons/mindnet-icon.svg",
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
  iconUrl: "/icons/mindnet-icon.svg",
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

export const config = getDefaultConfig({
  appName: "mind agent dapp",
  projectId: "caf8ddb78ed05799b8f45153c6837c94",
  wallets: [
    {
      groupName: "Recommended",
      wallets: [walletConnectWallet, rainbowWallet, metaMaskWallet],
    },
    {
      groupName: "Others",
      wallets: [injectedWallet],
    },
  ],
  chains: isDev() || isProd() ? [mindtestnet] : [mindnet],
  ssr: true, // If your dApp uses server side rendering (SSR)
});
