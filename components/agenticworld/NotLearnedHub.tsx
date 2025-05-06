import { useAgentGetTokenId, useHubGetCurrent } from "@/sdk";
import { useAsyncEffect } from "ahooks";
import { Modal } from "antd";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function NotLearnedHub() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const { data: agentTokenId } = useAgentGetTokenId();
  const { data: learningId } = useHubGetCurrent({
    tokenId: agentTokenId,
  });
  useEffect(() => {
    if (agentTokenId && !learningId) {
      setIsModalOpen(true);
    }
  }, [learningId]);

  return (
    <Modal
      title="⚠️ Reminder"
      open={isModalOpen}
      onCancel={handleCancel}
      className="mind-madal"
      footer={null}
    >
      <div className="text-[12px]">
        <div className="text-[var(--mind-brand)] leading-6">
          You haven&apos;t started your Agent&apos;s training in any Hubs yet.
        </div>
        <div className="leading-6">
          Rewards come only from hub training and work — staking alone
          won&apos;t earn anything.
        </div>
        <div className="leading-6">
          Click [Start Training] in any Basic Hub in AgenticWorld to begin
        </div>
      </div>
      <Link
        href="/agenticworld"
        style={{ height: "38px", lineHeight: "38px" }}
        className="btn-Link-white-font inline-block flex-grow-0 mt-[32px]"
        onClick={handleCancel}
      >
        Go AgenticWorld
      </Link>
    </Modal>
  );
}
