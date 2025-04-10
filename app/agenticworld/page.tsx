"use client";
import HubPage from "@/components/agenticworld/HubPage";
import { useGetAgentCount } from "@/sdk";
import useAgentGetTokenIdStore from "@/store/useAgentGetTokenId";
import Link from "next/link";
import React from "react";
import { useAccount } from "wagmi";

export default function Page() {
  const { isConnected } = useAccount();
  const agentTokenId = useAgentGetTokenIdStore((state) => state.agentTokenId);
  const isAgent = agentTokenId !== 0;
  const { data: totalAgent, loading } = useGetAgentCount();
  return (
    <div>
      <div
        className="px-[var(--layout-sm)] md:px-[var(--layout-md)] lg:px-[var(--layout-lg)] xl:px-[var(--layout-xl)] 2xl:px-[var(--layout-2xl)] bg-[url('/icons/agentic-world-bg.svg')] bg-top bg-cover bg-no-repeat
                    relative overflow-hidden"
      >
        <img
          src="/icons/earth.svg"
          alt="earth"
          className="absolute top-0 right-[20px] hidden sm:block"
        />
        <div className="mt-[30px] sm:mt-[70px] px-[20px]">
          <div className="text-[24px] sm:text-[40px] font-[900] capitalize text-center relative z-[10]">
            AgenticWorld
          </div>
          <div className="text-[14px] text-center mt-[20px] font-[600]">
            Total Agents:{" "}
            {!isConnected ? "/" : loading ? "loading..." : totalAgent}
            <div className="text-center mt-[15px] font-[600]">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[14px] text-[var(--mind-brand)] hover:text-[var(--mind-brand)] underline hover:underline"
              >
                User Guide
              </a>
            </div>
          </div>
          <div className={`text-center mt-[26px] ${isAgent ? "hidden" : ""}`}>
            <Link
              href="/agentlaunch"
              className="grent-btn-link h-[40px] w-[180px] leading-[32px] relative z-[10]"
            >
              Launch My AI Agent
            </Link>
          </div>
        </div>
        <HubPage />
      </div>
      <div className="h-[50px] sm:h-[200px] md:h-[300px] lg:h-[500px] relative">
        <img
          src="/icons/green-wave.svg"
          alt=""
          className="absolute bottom-0 w-full hidden sm:block"
        />
      </div>
    </div>
  );
}
