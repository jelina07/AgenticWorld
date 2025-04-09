import { useAgentGetStakeAmount, useAgentUnlock } from "@/sdk";
import { numberDigits, timestampToUTC } from "@/utils/utils";
import useAgentGetTokenIdStore from "@/store/useAgentGetTokenId";
export default function AirDropStakeSuccessShow() {
  const agentTokenId = useAgentGetTokenIdStore((state) => state.agentTokenId);
  const { data: unlockTimestamp } = useAgentUnlock({ manual: false });
  const { data: agentStakeAmount, refresh: refreshStakeAmount } =
    useAgentGetStakeAmount({
      tokenId: agentTokenId,
    });

  return (
    <div>
      <div className="text-[12px] leading-[1.8]">
        Your AI Agent is now active in AgenticWorld — ready to train and earn
        through Hubs.
      </div>
      <div className="text-[14px] flex justify-between flex-wrap gap-[5px] mt-[10px]">
        <span>Current Stake:</span>
        <span>{agentStakeAmount && numberDigits(agentStakeAmount)} FHE</span>
      </div>
      <div className="text-[14px] flex justify-between flex-wrap gap-[5px] mt-[10px]">
        <span>Lock Until:</span>
        <span>{unlockTimestamp && timestampToUTC(unlockTimestamp)}</span>
      </div>
    </div>
  );
}
