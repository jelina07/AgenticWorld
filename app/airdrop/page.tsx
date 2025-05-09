import AirDropEnd from "@/components/airdrop/AirDropEnd";
import AirdropRules from "@/components/airdrop/AirdropRules";
import BnbAirdropBox from "@/components/airdrop/BnbAirdropBox";
import Eligibility from "@/components/airdrop/Eligibility";
import EligibilityPreDeposit from "@/components/airdrop/EligibilityPreDeposit";
import React from "react";

export default function Page() {
  return (
    <div className="px-[var(--layout-sm)] md:px-[var(--layout-md)] lg:px-[var(--layout-lg)] xl:px-[var(--layout-xl)] 2xl:px-[var(--layout-2xl)] bg-[url('/icons/airdrop-bg.svg')] bg-top bg-cover bg-no-repeat pb-[200px]">
      {/* <div className="max-w-[700px] mx-auto">
        <Eligibility />
      </div> */}
      <div className="text-[24px] sm:text-[40px] text-center font-[800] pt-[50px]">
        Mind Network Airdrop
      </div>
      <div className="max-w-[700px] mx-auto relative pb-[300px]">
        <AirDropEnd />
        <BnbAirdropBox />
      </div>

      <div className="max-w-[800px] mx-auto relative">
        {/* <div className="text-[20px] font-[900] absolute sm:left-[110px] left-[35px]">
          Airdrops Rules
        </div>
        <AirdropRules /> */}
        <img
          src="/icons/rule-icons.svg"
          alt="rule-icons"
          className="absolute left-[-50px] bottom-[-40px] sm:block hidden"
        />
      </div>
    </div>
  );
}
