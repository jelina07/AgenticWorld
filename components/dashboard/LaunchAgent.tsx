import { useChainModal } from "@rainbow-me/rainbowkit";
import { Button } from "antd";
import Link from "next/link";
import React from "react";
import { useAccount } from "wagmi";

export default function LaunchAgent() {
  const { address } = useAccount();
  const { openChainModal } = useChainModal();
  return (
    <div className="lg:w-[70%] lg:mx-auto">
      <div className="font-[800]">My Agent</div>
      <div className="mt-[40px]">
        <Link href="/agentlaunch" className="btn-Link-brand-font">
          Launch Your First AI Agent
        </Link>
      </div>
      <div className={`mt-[20px] flex gap-[10px] ${address ? "" : "hidden"}`}>
        <Button
          type="primary"
          className="button-brand-border-white-font"
          onClick={openChainModal}
        >
          <img src="/icons/switch.svg" alt="switch" />
          Switch Network
        </Button>
      </div>
    </div>
  );
}
