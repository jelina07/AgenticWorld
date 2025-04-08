import { Button, Input, message, Modal, notification } from "antd";
import React, { useState } from "react";
import DownArraw from "@/public/icons/down-arraw.svg";
import useAgentGetTokenIdStore from "@/store/useAgentGetTokenId";
import {
  useAgentUnlock,
  useAgentUnStake,
  useGetFheBalance,
  useRelayerGetStatus,
  useRelayerUnstake,
} from "@/sdk";
import {
  checkAmountControlButtonShow,
  firstStakeAmount,
  judgeUseGasless,
  numberDigits,
} from "@/utils/utils";
import Max from "../utils/Max";
import Big from "big.js";
import { isDev, isProd } from "@/sdk/utils";
import useRelayerStatusHandler from "@/hooks/useRelayerStatusHandler";
import { Agent1ContractErrorCode } from "@/sdk/utils/script";
import { useAccount } from "wagmi";
import { useAsyncEffect } from "ahooks";

const successTip =
  isDev() || isProd()
    ? "Unstake Success ! Unstaking may take up to 2 minutes to process and arrive in your wallet !"
    : "Unstake Success ! Unstaking may take up to 48 hours to process and arrive in your wallet !";

export default function DecreseModal({
  refreshStakeAmount,
  agentStakeAmount,
}: {
  refreshStakeAmount: Function;
  agentStakeAmount?: string;
}) {
  const { chainId } = useAccount();
  const [amount, setAmount] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { runAsync: agentUnStake, loading: agentStakeLoading } =
    useAgentUnStake({
      waitForReceipt: true,
    });
  const agentTokenId = useAgentGetTokenIdStore((state) => state.agentTokenId);
  const { refresh: fheBalanceRefresh } = useGetFheBalance();
  const { runAsync: relayerAgentUnStake } = useRelayerUnstake();
  const {
    data: status,
    run: statusRun,
    cancel: statusCancel,
  } = useRelayerGetStatus("unstake");
  const [actionLoop, setActionLoop] = useState(false);
  const { data, runAsync: getAgentUnlock } = useAgentUnlock();
  console.log("datadata1", data);

  const isFirstlockUpTimeReached = true;

  const afterSuccessHandler = () => {
    refreshStakeAmount();
    fheBalanceRefresh();
    handleCancel();
  };

  useRelayerStatusHandler(
    status,
    statusCancel,
    afterSuccessHandler,
    setActionLoop,
    successTip,
    Agent1ContractErrorCode
  );

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
        if (judgeUseGasless(chainId)) {
          try {
            setActionLoop(true);
            const resId = await relayerAgentUnStake(agentTokenId!, amount);
            if (resId) {
              statusRun(chainId, resId);
            }
          } catch (error) {
            setActionLoop(false);
          }
        } else {
          const res = await agentUnStake(agentTokenId!, amount);
          if (res) {
            afterSuccessHandler();
            notification.success({
              message: "Success",
              description: successTip,
            });
          }
        }
      } else {
        const max = Number(agentStakeAmount!) - firstStakeAmount;
        message.open({
          type: "warning",
          content: `The agent must maintain a minimum of ${firstStakeAmount} tokens unless permanently shut down. The maximum amount you can unstake while keeping the agent alive is ${max} = (${agentStakeAmount} - ${firstStakeAmount}) !`,
          duration: 10,
        });
      }
    }
  };
  const clickMax = () => {
    setAmount(String(Number(agentStakeAmount) - firstStakeAmount));
  };

  useAsyncEffect(async () => {
    if (isModalOpen) {
      await getAgentUnlock(agentTokenId);
    }
  }, [isModalOpen]);

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
        {isFirstlockUpTimeReached ? (
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
                setAmount(e.target.value.trim());
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
                  !agentStakeAmount ||
                  agentStakeAmount === "0"
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
              loading={agentStakeLoading || actionLoop}
            >
              Unstake
            </Button>
          </div>
        ) : (
          <div>
            <div className="">
              Your FHE will be locked up until
              <span className="text-[var(--mind-brand)]">
                {" "}
                UTC 16:00, May 9, 2025
              </span>
              . You can only unstake after the lock-up period ends
            </div>
            <div className="flex justify-between">
              <div>Current Stake:</div>
              <div className="text-[var(--mind-brand)]">2000 FHE</div>
            </div>
            <Button
              type="primary"
              className="button-brand-border mt-[30px]"
              onClick={handleCancel}
            >
              Close
            </Button>
          </div>
        )}
      </Modal>
    </>
  );
}
