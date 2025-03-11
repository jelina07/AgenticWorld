const baseSiteConfig = {
  name: "Mind Network Agent Dapp",
  description: "Pioneering FHE Infrastructure for a Fully Encrypted Web3",
  url: "https://dapp.mindnetwork.xyz",
  keywords: [
    "Mind Network",
    "restake",
    "fhe",
    "FHE",
    "AI",
    "layer",
    "pos",
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
  ogImage: "<https://dapp.mindnetwork.xyz/og.jpeg>",
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
