import { useGetFaucet } from "@/sdk";
import { DAOKEN_ADDRESS } from "@/sdk/blockChain/address";
import { isDev, isProd } from "@/sdk/utils";
import { isSupportChain } from "@/sdk/utils/script";
import { getMore$FHE } from "@/utils/utils";
import { useChainModal } from "@rainbow-me/rainbowkit";
import { message, notification } from "antd";
import React from "react";
import { useAccount, useBalance } from "wagmi";
const currentUrl = window.location.origin + "/agentlaunch";
console.log("currentUrl", currentUrl);

export default function Facuet({ refreshFHE }: { refreshFHE: Function }) {
  const { address, chainId } = useAccount();
  const { openChainModal } = useChainModal();

  const { runAsync: getFaucet, loading } = useGetFaucet();

  const getTestToken = async () => {
    if (chainId !== 192940) {
      const res = await getFaucet();
      if (res) {
        await refreshFHE();
        notification.success({
          message: "Success",
          description: "Pilot Water Success",
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
        loading ? (
          <span rel="noopener noreferrer" className="text-[12px]">
            loading...
          </span>
        ) : (
          <span
            rel="noopener noreferrer"
            className="text-[12px] text-[var(--mind-brand)] hover:text-[var(--mind-brand)] whitespace-nowrap underline hover:underline cursor-pointer"
            onClick={getTestToken}
          >
            Get $FHE
          </span>
        )
      ) : (isDev() || isProd()) && !isSupportChain(chainId) ? (
        <span
          className="text-[12px] text-[var(--mind-brand)] cursor-pointer whitespace-nowrap"
          onClick={openChainModal}
        >
          Switch network
        </span>
      ) : (
        <a
          href={getMore$FHE}
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
