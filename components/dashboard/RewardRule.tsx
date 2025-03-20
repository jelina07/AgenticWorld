import React from "react";

export default function RewardRule() {
  return (
    <div className="text-[18px] font-[800] mb-[30px] mt-[50px]">
      <span>Rewards Rules</span>
      <div className="text-[14px] mt-[30px]">
        <span className="font-[500]">
          Your agent earns rewards through training and working, based on your
          FHE stake and the hub payout. The more FHE you stake, the higher your
          rewards. Detailed reward calculations and hub emissions can be found
        </span>{" "}
        <a
          href="http://"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white font-[500] underline hover:text-[var(--mind-brand)]"
        >
          here
        </a>
        <span className="font-[500]">.</span>
      </div>
    </div>
  );
}
