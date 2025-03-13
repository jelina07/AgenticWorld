import HubPage from "@/components/agenticworld/HubPage";
import Link from "next/link";
import React from "react";

export default function Page() {
  const isAgent = true;
  return (
    <div
      className="px-[var(--layout-sm)] sm:px-[var(--layout-md)] bg-[url('/icons/agentic-world-bg.svg')] bg-top bg-cover bg-no-repeat pb-[200px]
                    relative overflow-hidden"
    >
      <img
        src="/icons/earth.svg"
        alt="earth"
        className="absolute top-0 right-[20px] hidden sm:block"
      />
      <div className="mt-[30px] sm:mt-[70px]">
        <div className="text-[30px] sm:text-[40px] font-[900] capitalize text-center relative z-[10]">
          Agentic World
        </div>
        <div className={`text-center mt-[26px] ${isAgent ? "hidden" : ""}`}>
          <Link
            href="/agentlaunch"
            className="grent-btn-link h-[40px] w-[180px] leading-[32px]"
          >
            Launch My AI Agent
          </Link>
        </div>
      </div>
      <HubPage />
    </div>
  );
}
