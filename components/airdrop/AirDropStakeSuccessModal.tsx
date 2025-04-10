import { Button, Modal } from "antd";
import useControlModal from "@/store/useControlModal";
import { useAgentUnlock } from "@/sdk";
import useAgentGetTokenIdStore from "@/store/useAgentGetTokenId";
import { useEffect } from "react";
import { numberDigits, timestampToUTC } from "@/utils/utils";
import { useAsyncEffect } from "ahooks";
import Link from "next/link";

export default function AirDropStakeSuccessModal({
  refreshStakeAmount,
  agentStakeAmount,
}: {
  refreshStakeAmount: Function;
  agentStakeAmount?: string;
}) {
  const agentTokenId = useAgentGetTokenIdStore((state) => state.agentTokenId);
  const { data: unlockTimestamp, runAsync: getAgentUnlock } = useAgentUnlock();
  const { airdropSuccessModalopen, setIsAirdropSuccessModalopen } =
    useControlModal();

  const handleCancel = () => {
    setIsAirdropSuccessModalopen(false);
  };
  useAsyncEffect(async () => {
    if (airdropSuccessModalopen) {
      await getAgentUnlock(agentTokenId);
    }
  }, [airdropSuccessModalopen]);

  return (
    <>
      <Modal
        title="Success! Your Agent Is Live"
        open={airdropSuccessModalopen}
        onCancel={handleCancel}
        className="mind-madal"
        footer={null}
      >
        <div className="mt-[25px]">
          <div className="text-[12px] leading-[1.8]">
            Your AI Agent is now active in AgenticWorld — ready to train and
            earn through Hubs.
          </div>
          <div className="text-[14px] flex justify-between flex-wrap gap-[5px] mt-[25px]">
            <span>Current Stake:</span>
            <span className="text-[var(--mind-brand)]">
              {agentStakeAmount && numberDigits(agentStakeAmount)} FHE
            </span>
          </div>
          <div className="text-[14px] flex justify-between flex-wrap gap-[5px]">
            <span>Lock Until:</span>
            <span className="text-[var(--mind-brand)]">
              {unlockTimestamp && timestampToUTC(unlockTimestamp)}
            </span>
          </div>
          <Button
            type="primary"
            className="button-brand-border mt-[35px]"
            href="/agentlaunch"
          >
            Go AgenticWorld
          </Button>
          {/* <Link
            href="/agentlaunch"
            className="btn-Link-white-font inline-block flex-grow-0 mt-[35px]"
            onClick={() => setIsAirdropSuccessModalopen(false)}
          >
            Go AgenticWorld
          </Link> */}
        </div>
      </Modal>
    </>
  );
}
