import { isDev, isMainnetio, isProd } from "@/sdk/utils";

const baseSiteConfig = {
  name: "Mind Network AgenticWorld",
  description:
    "Pioneering FHE Infrastructure for a Fully Encrypted AgenticWorld and Web3",
  url: isDev()
    ? "https://agenttest.mindnetwork.io/"
    : isProd()
    ? "https://agenttest.mindnetwork.xyz/"
    : isMainnetio()
    ? "https://agent.mindnetwork.io/"
    : "https://agent.mindnetwork.xyz/",
  keywords: [
    "Mind Network",
    "agent",
    "agenticworld",
    "agentic world",
    "fhe",
    "FHE",
    "AI",
    "layer",
    "restake",
    "network",
    "dapp",
  ],
  authors: [
    {
      name: "mindnetwork_xyz",
      url: "<https://twitter.com/mindnetwork_xyz>",
    },
  ],
  creator: "@mindnetwork_xyz",
  icons: {
    icon: "/favicon.ico",
  },
  ogImage: isDev()
    ? "https://agenttest.mindnetwork.io/og.jpeg"
    : isProd()
    ? "https://agenttest.mindnetwork.xyz/og.jpeg"
    : isMainnetio()
    ? "https://agent.mindnetwork.io/og.jpeg"
    : "https://agent.mindnetwork.xyz/og.jpeg",
  links: {
    twitter: "<https://twitter.com/mindnetwork_xyz>",
    github: "<https://github.com/mind-network",
  },
};

export const siteConfig = {
  ...baseSiteConfig,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseSiteConfig.url,
    title: baseSiteConfig.name,
    description: baseSiteConfig.description,
    siteName: baseSiteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: baseSiteConfig.name,
    description: baseSiteConfig.description,
    images: [`${baseSiteConfig.url}/og.jpeg`],
    creator: baseSiteConfig.creator,
  },
};
