"use client";
import "@rainbow-me/rainbowkit/styles.css";
import {
  darkTheme,
  DisclaimerComponent,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { config } from "@/sdk/wagimConfig";

const queryClient = new QueryClient();

const Disclaimer: DisclaimerComponent = ({ Text, Link }) => (
  <Text>
    By connecting your wallet, you agree to the{" "}
    <Link href="https://docs.mindnetwork.xyz/minddocs/security-and-privacy/mind-network-terms-of-service">
      Terms & Conditions
    </Link>{" "}
    and acknowledge you have read and understand the{" "}
    <Link href="https://docs.mindnetwork.xyz/minddocs/security-and-privacy/mind-network-privacy-policy">
      Privacy Policy.
    </Link>
  </Text>
);
export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme()}
          appInfo={{
            appName: "Mind agent dapp",
            disclaimer: Disclaimer,
          }}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
