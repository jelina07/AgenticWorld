import AirdropRules from "@/components/airdrop/AirdropRules";
import Eligibility from "@/components/airdrop/Eligibility";
import React from "react";

export default function Page() {
  return (
    <div className="px-[var(--layout-sm)] md:px-[var(--layout-md)] lg:px-[var(--layout-lg)] xl:px-[var(--layout-xl)] 2xl:px-[var(--layout-2xl)] bg-[url('/icons/airdrop-bg.svg')] bg-top bg-cover bg-no-repeat pb-[200px]">
      <div className="max-w-[680px] mx-auto">
        <Eligibility />
        <AirdropRules />
      </div>
    </div>
  );
}
