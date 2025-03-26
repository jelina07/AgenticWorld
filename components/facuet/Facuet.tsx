import { DAOKEN_ADDRESS } from "@/sdk/blockChain/address";
import { isDev, isProd } from "@/sdk/utils";
import { isSupportChain } from "@/sdk/utils/script";
import { useChainModal } from "@rainbow-me/rainbowkit";
import { message } from "antd";
import React from "react";
import { useAccount, useBalance } from "wagmi";
const currentUrl = window.location.origin + window.location.pathname;

export default function Facuet() {
  const { address, chainId } = useAccount();
  const { openChainModal } = useChainModal();
  const gas = useBalance({
    address,
  });
  console.log("gas", gas);

  const getTestToken = () => {
    if (chainId !== 192940) {
      //judge gas
      if (gas.data?.formatted && Number(gas.data?.formatted) > 0) {
        window.open(
          `https://faucet.mindnetwork.io?wallet=${address}&token=${
            DAOKEN_ADDRESS[chainId!]
          }&redirectUrl=${currentUrl}`
        );
      } else {
        message.open({
          type: "warning",
          content: `You have 0 gas fee in your wallet, Make sure you have enough gas in your wallet.`,
          duration: 8,
        });
      }
    } else {
      window.open(
        `https://faucet.mindnetwork.io?wallet=${address}&token=${
          DAOKEN_ADDRESS[chainId!]
        }&redirectUrl=${currentUrl}`
      );
    }
  };

  return (
    <>
      {chainId === undefined ? (
        <></>
      ) : (isDev() || isProd()) && isSupportChain(chainId) ? (
        <span
          rel="noopener noreferrer"
          className="text-[12px] text-[var(--mind-brand)] hover:text-[var(--mind-brand)] whitespace-nowrap underline hover:underline cursor-pointer"
          onClick={getTestToken}
        >
          Get $FHE
        </span>
      ) : (isDev() || isProd()) && !isSupportChain(chainId) ? (
        <span
          className="text-[12px] text-[var(--mind-brand)] cursor-pointer whitespace-nowrap"
          onClick={openChainModal}
        >
          Switch network
        </span>
      ) : (
        <a
          href="http://"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[12px] text-[var(--mind-brand)] hover:text-[var(--mind-brand)] whitespace-nowrap underline hover:underline"
        >
          Get $FHE
        </a>
      )}
    </>
  );
}
