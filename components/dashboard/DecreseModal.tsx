import { Button, Input, message, Modal } from "antd";
import React, { useState } from "react";
import DownArraw from "@/public/icons/down-arraw.svg";
import useAgentGetTokenIdStore from "@/store/useAgentGetTokenId";
import { useAgentUnStake } from "@/sdk";
import { checkAmountControlButtonShow } from "@/utils/utils";

export default function DecreseModal({
  refreshStakeAmount,
  agentStakeAmount,
}: {
  refreshStakeAmount: Function;
  agentStakeAmount?: string;
}) {
  const [amount, setAmount] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { runAsync: agentUnStake, loading: agentStakeLoading } =
    useAgentUnStake({
      waitForReceipt: true,
    });
  const agentTokenId = useAgentGetTokenIdStore((state) => state.agentTokenId);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setAmount("");
  };
  const unstake = async () => {
    if (checkAmountControlButtonShow(amount)) {
      if (
        agentStakeAmount &&
        Number(agentStakeAmount) - Number(amount) >= 100
      ) {
        const res = await agentUnStake(agentTokenId!, amount);
        if (res) {
          refreshStakeAmount();
          handleCancel();
        }
      } else {
        message.open({
          type: "warning",
          content:
            "The amount you've entered is too large, you need at least 100 tokens in the agent.",
          duration: 5,
        });
      }
    }
  };
  return (
    <>
      <Button
        type="primary"
        className="button-brand-border-white-font"
        onClick={showModal}
      >
        Decrease
      </Button>
      <Modal
        title="Deduct Your Stake To Agent"
        open={isModalOpen}
        onCancel={handleCancel}
        className="mind-madal"
        footer={null}
      >
        <div className="mind-input">
          <Input
            value={amount}
            style={{ height: "46px", marginTop: "20px" }}
            onChange={(e: any) => {
              setAmount(e.target.value);
            }}
          />
          <div>
            <div className="flex items-center gap-[2px] justify-end mt-[20px]">
              <span className="text-[14px] font-[500]">rewards earning</span>
              <span className="text-[20px] font-[500] text-[var(--mind-red)]">
                ~10%
              </span>
              <DownArraw />
            </div>
          </div>
          <Button
            type="primary"
            className="button-brand-border mt-[30px]"
            disabled={amount === ""}
            onClick={unstake}
            loading={agentStakeLoading}
          >
            Unstake
          </Button>
        </div>
      </Modal>
    </>
  );
}
