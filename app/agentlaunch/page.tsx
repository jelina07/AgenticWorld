import BeginInfo3 from "@/components/agentlaunch/beginInfo3";
import React from "react";

export default function Page() {
  return (
    <div
      className="px-[var(--layout-sm)] md:px-[var(--layout-md)] lg:px-[var(--layout-lg)] bg-[url('/icons/agentic-launch-bg.svg')] bg-top bg-cover bg-no-repeat pb-[200px]
                    relative overflow-hidden"
    >
      <img
        src="/icons/earth.svg"
        alt="earth"
        className="absolute top-0 right-[20px] hidden sm:block"
      />
      <div className="px-[20px]">
        <BeginInfo3 />
      </div>
    </div>
  );
}
