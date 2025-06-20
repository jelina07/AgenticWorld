import { isSupportChain } from "@/sdk/utils/script";
import {
  numberDigits,
  numberDigitsNoMillify,
  secondsToHours,
} from "@/utils/utils";
import React from "react";
import { useAccount } from "wagmi";

export default function HubInfo({
  lockUp,
  agentCount,
  hubStakeAmount,
  hubApy,
}: {
  lockUp?: number;
  agentCount?: number;
  hubStakeAmount?: string;
  hubApy?: string;
}) {
  const { isConnected, chainId } = useAccount();
  return (
    <div className="flex justify-between gap-[20px] flex-wrap">
      {/* <div className="p-[30px] flex-1 rounded-[10px] bg-[var(--bg-deep-grey)]">
        <div className="text-[15px]">Enrolled Agents</div>
        <div className="text-[38px] text-light-shadow mt-[20px]">
          {!isConnected
            ? "/"
            : agentCount !== undefined
            ? numberDigitsNoMillify(agentCount)
            : "loading..."}
        </div>
      </div> */}
      <div className="p-[30px] flex-[1.3] min-w-[250px] rounded-[10px] bg-[url('/images/bg-heavy.png')] bg-cover bg-no-repeat">
        <div className="text-[15px]">Emission Rate</div>
        <div className="text-[38px] text-light-shadow mt-[20px] break-all">
          {!isConnected || (chainId && !isSupportChain(chainId))
            ? "/"
            : hubApy !== undefined
            ? hubApy
            : "loading..."}
        </div>
      </div>
      <div className="p-[30px] flex-[1.3] rounded-[10px] bg-[var(--bg-deep-grey)]">
        <div className="text-[15px]">Total Stake</div>
        <div className="text-[38px] text-light-shadow mt-[20px]">
          {/* {!isConnected
            ? "/"
            : hubStakeAmount !== undefined
            ? numberDigits(hubStakeAmount)
            : "loading..."} */}
          {hubStakeAmount !== undefined
            ? numberDigits(hubStakeAmount)
            : "loading..."}
        </div>
      </div>
      <div className="p-[30px] flex-1 rounded-[10px] bg-[var(--bg-deep-grey)]">
        <div className="text-[15px]">Training Lock-up</div>
        <div className="text-[38px] text-light-shadow mt-[20px]">
          {lockUp !== undefined && lockUp !== null
            ? secondsToHours(lockUp) + " H"
            : "loading..."}
        </div>
      </div>
    </div>
  );
}
