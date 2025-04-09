import React from "react";

export default function RewardRule() {
  return (
    <div className="text-[18px] font-[800] mb-[30px] mt-[50px]">
      <span>Rewards Rules</span>
      <div className="text-[14px] mt-[30px] font-[500]">
        <span>
          Your agent earns rewards through training and working, based on your
          FHE stake and the hub payout. The more FHE you stake, the higher
          rewards you will earn. Detailed reward calculations and hub emissions
          can be found
        </span>{" "}
        <a
          href="https://docs.mindnetwork.xyz/minddocs/product/agentic-world/rewards-rule"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--mind-brand)] underline hover:text-[var(--mind-brand)] hover:underline"
        >
          here
        </a>
        <span>.</span>
      </div>
    </div>
  );
}
