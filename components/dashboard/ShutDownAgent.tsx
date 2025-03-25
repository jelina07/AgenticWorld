"use client";
import { useAgentBurn, useAgentUnStake, useGetFheBalance } from "@/sdk";
import { checkAmountControlButtonShow } from "@/utils/utils";
import { Button, Modal, notification } from "antd";
import React, { useState } from "react";
import useAgentGetTokenIdStore from "@/store/useAgentGetTokenId";

export default function ShutDownAgent({
  refreshStakeAmount,
  agentStakeAmount,
}: {
  refreshStakeAmount: Function;
  agentStakeAmount?: string;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { runAsync: agentBurn, loading: agentBurnLoading } = useAgentBurn({
    waitForReceipt: true,
  });
  const agentTokenId = useAgentGetTokenIdStore((state) => state.agentTokenId);
  const refreshAgentTokenId = useAgentGetTokenIdStore(
    (state) => state.refreshGetAgentTokenId
  );
  const { refresh: fheBalanceRefresh } = useGetFheBalance();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const shoutDown = async () => {
    if (checkAmountControlButtonShow(agentStakeAmount!)) {
      const res = await agentBurn(agentTokenId!);
      if (res) {
        refreshStakeAmount();
        fheBalanceRefresh();
        refreshAgentTokenId();
        handleCancel();
        notification.success({
          message: "Success",
          description: "Your agent has been successfully shut down !",
        });
      }
    }
  };
  return (
    <>
      <div className="capitalize underline text-[12px] text-[var(--mind-brand)] text-right mt-[10px]">
        <span onClick={showModal} className="cursor-pointer">
          Permanently Shut Down My Agent ?
        </span>
      </div>
      <Modal
        title="Shut Down Your Agent"
        open={isModalOpen}
        onCancel={handleCancel}
        className="mind-madal"
        footer={null}
      >
        <div className="mind-input">
          <div className="text-[12px] font-[400]">
            This action will permanently shut down your agent and cannot be
            undone. You will lose all access to your current agent.
          </div>
          <div className="text-[12px] font-[400] mt-[17px]">Unstaking FHE</div>
          <div
            className=" px-[11px] py-[4px] mt-[15px] h-[45px] flex items-center
                            bg-[#181818] rounded-[10px] border-[length:var(--border-width)] border-[var(--btn-border)]"
          >
            <div className="flex-1 flex justify-between items-center">
              <span className="text-[var(--mind-brand)] text-[14px]">
                {agentStakeAmount ? agentStakeAmount : "loading..."}
              </span>
              <span className="text-[14px] text-[var(--mind-grey)]">FHE</span>
            </div>
          </div>
          <div className="flex mt-[30px] gap-[20px]">
            <Button
              type="primary"
              className="button-white-border-white-font"
              disabled={agentStakeAmount === undefined}
              loading={agentBurnLoading}
              onClick={shoutDown}
            >
              Confirm
            </Button>
            <Button
              type="primary"
              className="button-brand-border-white-font"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
