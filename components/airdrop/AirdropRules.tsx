import React from "react";
import RulesItem from "./RulesItem";

const ruleList = [
  {
    imgurl: "/icons/rule-logo1.svg",
    title: "CitizenZ Passport",
    info: "All eligible wallets receive a base allocation of 1,500 $FHE tokens.",
  },
  {
    imgurl: "/icons/rule-logo2.svg",
    title: "vFHE Delegation",
    info: "Early users of Mind Network receive an additional 500 $FHE tokens.",
  },
  {
    imgurl: "/icons/rule-logo3.svg",
    title: "Advocate Program",
    info: "Users who contributed to the network growth receive an additional 1,000 $FHE tokens.",
  },
  {
    imgurl: "/icons/rule-logo4.svg",
    title: "AgentConnect Hub Engagement",
    info: "Users who stake in the Mind Network ecosystem receive a 20% bonus on their total allocation.",
  },
  {
    imgurl: "/icons/rule-logo5.svg",
    title: "Testnet and Early Community Contributers",
    info: "The airdrop claiming period is open for 30 days from the lauunch date. Unclaimed tokens will be returned to the community treasury.",
  },
];
export default function AirdropRules() {
  return (
    <div className="px-[35px] pb-[35px] pt-[12px] mt-[20px] bg-[url('/icons/rule-bg.svg')] bg-no-repeat bg-center relative">
      <div className="text-[20px] font-[900]">Airdrops Rules</div>
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
      <div className="text-[12px] px-[20px] mt-[25px]">
        <span>Note: </span>
        <span className="text-[var(--mind-grey)]">
          To claim your tokens, you must be connected to the MindChain. Use the
          &quot;Switch to Mindchain&quot; button to change your network if
          needed.
        </span>
      </div>
      <img
        src="/icons/rule-icons.svg"
        alt="rule-icons"
        className="absolute left-[-100px] bottom-[-40px]"
      />
    </div>
  );
}
