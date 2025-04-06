import React from "react";
import RulesItem from "./RulesItem";

const ruleList = [
  {
    imgurl: "/icons/rule-logo1.svg",
    title: "CitizenZ Passport",
    info: "All CitizenZ Passport NFT holders before the snapshot receive equal shares of the airdrop allocation.",
  },
  {
    imgurl: "/icons/rule-logo2.svg",
    title: "Mainnet Contributors",
    info: "Rewards are based on your vFHE delegation at the time of the snapshot, including TGV (Tokenized Governance Value), Hub voting, delegation rewards, and community campaigns. TGV from Mind Network qualifies for a higher multiplier.",
  },
  {
    imgurl: "/icons/rule-logo3.svg",
    title: "Advocate Program",
    info: "The calculation is based on successful and valid referrals.",
  },
  {
    imgurl: "/icons/rule-logo4.svg",
    title: "AgentConnect Hub",
    info: "Equal share of 0.3% allocation for all genuine Hub registrants, with additional 0.7% reserved for future phases.",
  },
  {
    imgurl: "/icons/rule-logo5.svg",
    title: "Community Contributors",
    info: "Eligible with any one: Testnet active participation, having a Discord exclusive role, having at least 600 Galxe points, actively participating in Zealy, or holding a Mind FHEellow NFT.",
  },
];
export default function AirdropRules() {
  return (
    <div>
      <div className="px-[15px] sm:px-[35px] pb-[35px] pt-[12px] mt-[20px] airdrop-box bg-[#141716] max-w-[700px] mx-auto">
        <div className="mt-[30px]">
          {ruleList.map((item, index) => (
            <RulesItem
              imgurl={item.imgurl}
              title={item.title}
              info={item.info}
              key={index}
            />
          ))}
        </div>
        <div className="text-[14px] px-[20px] mt-[22px] font-[700] text-center text-[var(--mind-brand)]">
          Snapshot was taken on March 31, 2025, 23:59 UTC
        </div>
      </div>
    </div>
  );
}
