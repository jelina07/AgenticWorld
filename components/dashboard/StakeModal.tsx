import { Button, Input, message, Modal } from "antd";
import React, { useState } from "react";
import UpArraw from "@/public/icons/up-arraw.svg";
import { checkAmountControlButtonShow } from "@/utils/utils";
import { useAgentStake } from "@/sdk";
import useAgentGetTokenIdStore from "@/store/useAgentGetTokenId";

export default function DecreseModal({
  refreshStakeAmount,
}: {
  refreshStakeAmount: Function;
}) {
  const [amount, setAmount] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { runAsync: agentStake, loading: agentStakeLoading } = useAgentStake({
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
  const stake = async () => {
    if (checkAmountControlButtonShow(amount)) {
      const res = await agentStake(agentTokenId!, amount);
      if (res) {
        refreshStakeAmount();
        handleCancel();
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
        Increase
      </Button>
      <Modal
        title="Add Stake To Your Agent"
        open={isModalOpen}
        onCancel={handleCancel}
        className="mind-madal"
        footer={null}
      >
        <div className="mind-input">
          <Input
            style={{ height: "46px", marginTop: "20px" }}
            value={amount}
            onChange={(e: any) => {
              setAmount(e.target.value);
            }}
          />
          <div>
            <div className="flex justify-between items-center mt-[20px]">
              <span className="text-[14px] font-[400]">+1000 FHE</span>
              <div className="flex items-center gap-[2px]">
                <span className="text-[14px] font-[500]">rewards earning</span>
                <span className="text-[20px] font-[500] text-[var(--mind-brand)]">
                  ~10%
                </span>
                <UpArraw />
              </div>
            </div>
            <div className="flex justify-between items-center mt-[5px]">
              <span className="text-[14px] font-[400]">+10000 FHE</span>
              <div className="flex items-center gap-[2px]">
                <span className="text-[14px] font-[500]">rewards earning</span>
                <span className="text-[20px] font-[500] text-[var(--mind-brand)]">
                  ~100%
                </span>
                <UpArraw />
              </div>
            </div>
          </div>
          <Button
            type="primary"
            className="button-brand-border mt-[30px]"
            disabled={amount === ""}
            onClick={stake}
            loading={agentStakeLoading}
          >
            Stake
          </Button>
        </div>
      </Modal>
    </>
  );
}
