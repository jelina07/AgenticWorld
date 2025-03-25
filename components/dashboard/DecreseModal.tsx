import { Button, Input, message, Modal, notification } from "antd";
import React, { useState } from "react";
import DownArraw from "@/public/icons/down-arraw.svg";
import useAgentGetTokenIdStore from "@/store/useAgentGetTokenId";
import { useAgentUnStake, useGetFheBalance } from "@/sdk";
import {
  checkAmountControlButtonShow,
  firstStakeAmount,
  numberDigits,
} from "@/utils/utils";
import Max from "../utils/Max";
import Big from "big.js";
import useGetFheBalanceStore from "@/store/useGetFheBalanceStore";

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
  const { refresh: fheBalanceRefresh } = useGetFheBalance();

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
        Number(agentStakeAmount) - Number(amount) >= firstStakeAmount
      ) {
        const res = await agentUnStake(agentTokenId!, amount);
        if (res) {
          refreshStakeAmount();
          fheBalanceRefresh();
          handleCancel();
          notification.success({
            message: "Success",
            description: "Unstake Success !",
          });
        }
      } else {
        const max = Number(agentStakeAmount!) - firstStakeAmount;
        message.open({
          type: "warning",
          content: `The agent must maintain a minimum of ${firstStakeAmount} tokens unless permanently shut down. The maximum amount you can unstake while keeping the agent alive is ${numberDigits(
            max
          )} = (${agentStakeAmount} - ${firstStakeAmount}) !`,
          duration: 10,
        });
      }
    }
  };
  const clickMax = () => {
    setAmount(String(Number(agentStakeAmount) - 100));
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
          <div className="text-[14px]  flex justify-between flex-wrap gap-[5px] mt-[10px]">
            <span>Current Stake:</span>
            <span>{agentStakeAmount} FHE</span>
          </div>
          <Input
            value={amount}
            style={{ height: "46px", marginTop: "20px" }}
            suffix={
              <div onClick={clickMax} className="cursor-pointer">
                <Max />
              </div>
            }
            onChange={(e: any) => {
              setAmount(e.target.value);
            }}
          />
          <div>
            <div
              className={`flex items-center gap-[2px] justify-end mt-[20px] ${
                isNaN(Number(amount)) ? "hidden" : ""
              }`}
            >
              <span className="text-[14px] font-[500]">rewards earning</span>
              <span className="text-[20px] font-[500] text-[var(--mind-red)]">
                ~
                {Number(amount) === 0 ||
                isNaN(Number(amount)) ||
                !agentStakeAmount
                  ? "0%"
                  : numberDigits(
                      new Big(amount)
                        .div(agentStakeAmount)
                        .times(100)
                        .toString()
                    ) + "%"}
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
