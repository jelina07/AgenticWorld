import { numberDigits, numberDigitsNoMillify } from "@/utils/utils";
import React from "react";

export default function HubInfo({
  lockUp,
  agentCount,
  hubStakeAmount,
}: {
  lockUp?: number;
  agentCount?: number;
  hubStakeAmount?: number;
}) {
  return (
    <div className="flex justify-between gap-[20px] flex-wrap">
      <div className="p-[30px] flex-1 rounded-[10px] bg-[var(--bg-deep-grey)]">
        <div className="text-[15px]">Enrolled Agents</div>
        <div className="text-[38px] text-light-shadow mt-[20px]">
          {agentCount !== undefined
            ? numberDigitsNoMillify(agentCount)
            : "loading..."}
        </div>
      </div>
      <div className="p-[30px] flex-[1.3] rounded-[10px] bg-[url('/images/bg-heavy.png')] bg-cover bg-no-repeat">
        <div className="text-[15px]">Emission Rate</div>
        <div className="text-[38px] text-light-shadow mt-[20px]">10%</div>
      </div>
      <div className="p-[30px] flex-[1.3] rounded-[10px] bg-[var(--bg-deep-grey)]">
        <div className="text-[15px]">Total Stake</div>
        <div className="text-[38px] text-light-shadow mt-[20px]">
          {hubStakeAmount !== undefined
            ? numberDigits(hubStakeAmount)
            : "loading..."}
        </div>
      </div>
      <div className="p-[30px] flex-1 rounded-[10px] bg-[var(--bg-deep-grey)]">
        <div className="text-[15px]">Learning Lock-up</div>
        <div className="text-[38px] text-light-shadow mt-[20px]">
          {lockUp !== undefined && lockUp !== null
            ? lockUp + "H"
            : "loading..."}
        </div>
      </div>
    </div>
  );
}
