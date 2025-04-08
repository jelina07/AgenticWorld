import { Button, Input, message, Modal, notification } from "antd";
import React, { useState } from "react";
import UpArraw from "@/public/icons/up-arraw.svg";
import { checkAmountControlButtonShow, judgeUseGasless } from "@/utils/utils";
import {
  useAgentStake,
  useGetFheBalance,
  useHubGetApy,
  useRelayerGetStatus,
  useRelayerStake,
} from "@/sdk";
import useAgentGetTokenIdStore from "@/store/useAgentGetTokenId";
import useGetFheBalanceStore from "@/store/useGetFheBalanceStore";
import Max from "../utils/Max";
import { useAsyncEffect } from "ahooks";
import { useAccount } from "wagmi";
import useRelayerStatusHandler from "@/hooks/useRelayerStatusHandler";
import { Agent1ContractErrorCode } from "@/sdk/utils/script";

const successTip = "Stake Success !";

export default function StakeModal({
  refreshStakeAmount,
  agentStakeAmount,
  learningId,
  hubList,
}: {
  refreshStakeAmount: Function;
  agentStakeAmount?: string;
  learningId: number;
  hubList?: any[];
}) {
  const { chainId } = useAccount();
  const [amount, setAmount] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { runAsync: agentStake, loading: agentStakeLoading } = useAgentStake({
    waitForReceipt: true,
  });
  const agentTokenId = useAgentGetTokenIdStore((state) => state.agentTokenId);
  const { data: hubApy } = useHubGetApy({ hubIds: hubList });
  const currentIndex = hubList?.findIndex((item) => item.id === learningId);
  const { runAsync, refresh: fheBalanceRefresh, loading } = useGetFheBalance();
  const { balance } = useGetFheBalanceStore();
  const { runAsync: relayerAgentStake } = useRelayerStake();
  const {
    data: status,
    run: statusRun,
    cancel: statusCancel,
  } = useRelayerGetStatus("stake");
  const [actionLoop, setActionLoop] = useState(false);

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

  const stake = async () => {
    if (checkAmountControlButtonShow(amount)) {
      if (Number(amount) > Number(balance)) {
        message.open({
          type: "warning",
          content: "The amount you enter is greater than your balance",
          duration: 5,
        });
      } else {
        if (judgeUseGasless(chainId)) {
          try {
            setActionLoop(true);
            const resId = await relayerAgentStake(agentTokenId!, amount);
            if (resId) {
              statusRun(chainId, resId);
            }
          } catch (error) {
            setActionLoop(false);
          }
        } else {
          const res = await agentStake(agentTokenId!, amount);
          if (res) {
            afterSuccessHandler();
            notification.success({
              message: "Success",
              description: successTip,
            });
          }
        }
      }
    }
  };

  const clickMax = () => {
    setAmount(balance);
  };
  useAsyncEffect(async () => {
    await runAsync();
  }, [isModalOpen]);
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
          <div className="mt-[30px]">
            <div className="text-[14px] flex justify-between flex-wrap gap-[5px]">
              <span>APY:</span>
              <span>
                {currentIndex && hubApy ? hubApy[currentIndex] : "0%"}
              </span>
            </div>
            <div className="text-[14px]  flex justify-between flex-wrap gap-[5px] mt-[10px]">
              <span>Current Stake:</span>
              <span>{agentStakeAmount} FHE</span>
            </div>
          </div>
          <Input
            style={{ height: "46px", marginTop: "20px" }}
            value={amount}
            suffix={
              <div onClick={clickMax} className="cursor-pointer">
                <Max />
              </div>
            }
            onChange={(e: any) => {
              setAmount(e.target.value.trim());
            }}
          />
          <div className="text-[12px] flex justify-between gap-[5px] flex-wrap mt-[10px]">
            <span>Balance:</span>
            <div className="flex gap-[2px] items-center">
              <span>{loading ? "loading..." : balance + " FHE"}</span>
              <img
                src="/icons/refresh.svg"
                alt="refresh"
                onClick={fheBalanceRefresh}
                className={`cursor-pointer ${loading ? "refresh" : ""}`}
              />
            </div>
          </div>
          <Button
            type="primary"
            className="button-brand-border mt-[30px]"
            disabled={amount === ""}
            onClick={stake}
            loading={agentStakeLoading || actionLoop}
          >
            Stake
          </Button>
        </div>
      </Modal>
    </>
  );
}
