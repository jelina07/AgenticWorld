import {
  useAgentGetTokenId,
  useAgentStake,
  useGetFheBalance,
  useRelayerStake,
  useRelayerGetStatus,
} from "@/sdk";
import useAgentGetTokenIdStore from "@/store/useAgentGetTokenId";
import useGetFheBalanceStore from "@/store/useGetFheBalanceStore";
import {
  $FHELockupperiod,
  checkAmountControlButtonShow,
  firstStakeAmount,
  judgeUseGasless,
  launchAgent,
  numberDigits,
} from "@/utils/utils";
import { Button, Input, message, Modal, notification } from "antd";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import Facuet from "../facuet/Facuet";
import { useAccount } from "wagmi";
import { Agent1ContractErrorCode } from "@/sdk/utils/script";
import useRelayerStatusHandler from "@/hooks/useRelayerStatusHandler";
import Max from "../utils/Max";

export default function AirDropStakeModal({
  refreshStakeAmount,
}: {
  refreshStakeAmount: Function;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { chainId } = useAccount();
  const [amount, setAmount] = useState("");
  const { runAsync: agentStake, loading: agentStakeLoading } = useAgentStake({
    waitForReceipt: true,
  });
  const { refresh: agentGetTokenIdRefresh } = useAgentGetTokenId();

  const agentTokenId = useAgentGetTokenIdStore((state) => state.agentTokenId);
  const isAgent = agentTokenId !== 0;
  const successTip = isAgent ? "Stake Success !" : "Launch Success !";
  const { refresh: fheBalanceRefresh, loading } = useGetFheBalance();
  const { balance } = useGetFheBalanceStore();
  const { runAsync: relayerAgentStake } = useRelayerStake();
  const {
    data: status,
    run: statusRun,
    cancel: statusCancel,
  } = useRelayerGetStatus("stake");
  const [actionLoop, setActionLoop] = useState(false);

  const clickMax = () => {
    setAmount(balance);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setAmount("");
  };
  const showModal = () => {
    setIsModalOpen(true);
  };

  const afterSuccessHandler = () => {
    agentGetTokenIdRefresh();
    fheBalanceRefresh();
    refreshStakeAmount();
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

  const stake = async () => {
    if (checkAmountControlButtonShow(amount)) {
      const judgeCondition = !isAgent
        ? Number(amount) < firstStakeAmount
        : false;
      if (judgeCondition) {
        message.open({
          type: "warning",
          content: `The minimum required amount is ${firstStakeAmount} !`,
          duration: 5,
        });
      } else if (Number(amount) > Number(balance)) {
        message.open({
          type: "warning",
          content: "The amount you enter is greater than your balance !",
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
          try {
            const res = await agentStake(agentTokenId!, amount);
            if (res) {
              afterSuccessHandler();
              notification.success({
                message: "Success",
                description: successTip,
              });
            }
          } catch (error) {}
        }
      }
    }
  };

  return (
    <>
      <Button
        type="primary"
        className="button-brand-border mt-[10px]"
        onClick={showModal}
      >
        {isAgent ? "Stake" : launchAgent}
      </Button>
      <Modal
        title={!isAgent ? "Launch Your AI Agent" : "Stake to your AI Agent"}
        open={isModalOpen}
        onCancel={handleCancel}
        className="mind-madal"
        footer={null}
      >
        <div className="mind-input">
          <div className="text-[14px] mt-[20px]">
            {!isAgent ? (
              <div>Minimum staking: {firstStakeAmount} $FHE</div>
            ) : (
              <></>
            )}
            <div className="mt-[10px]">
              $FHE from Mind Network Ecosystem Incentive & Potential Partner
              tokens
            </div>
            <div className="mt-[10px]">
              $FHE Lock-up period: {$FHELockupperiod} days
            </div>
          </div>
          <Input
            style={{ height: "45px", margin: "26px 0 0 0" }}
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
          <div className="flex justify-between mt-[10px] mb-[26px] text-[14px]">
            <span>FHE Balance:</span>
            <div className="flex items-center gap-[3px]">
              <span>
                {loading
                  ? "loading..."
                  : balance === undefined || numberDigits(balance) + " FHE"}
              </span>
              <img
                src="/icons/refresh.svg"
                alt="refresh"
                onClick={fheBalanceRefresh}
                className={`cursor-pointer ${loading ? "refresh" : ""}`}
              />
            </div>
          </div>

          <div className="flex items-end gap-[10px]">
            <Button
              type="primary"
              className="button-brand-border"
              disabled={amount === ""}
              onClick={stake}
              loading={agentStakeLoading || actionLoop}
            >
              {!isAgent ? launchAgent : "Stake"}
            </Button>
            <Facuet refreshFHE={fheBalanceRefresh} />
          </div>
        </div>
      </Modal>
    </>
  );
}
