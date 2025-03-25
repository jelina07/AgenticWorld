"use client";
import HubPage from "@/components/agenticworld/HubPage";
import useAgentGetTokenIdStore from "@/store/useAgentGetTokenId";
import Link from "next/link";
import React from "react";

export default function Page() {
  const agentTokenId = useAgentGetTokenIdStore((state) => state.agentTokenId);
  const isAgent = agentTokenId !== 0;
  return (
    <div
      className="px-[var(--layout-sm)] md:px-[var(--layout-md)] lg:px-[var(--layout-lg)] bg-[url('/icons/agentic-world-bg.svg')] bg-top bg-cover bg-no-repeat pb-[200px]
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
  );
}
