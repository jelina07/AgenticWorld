"use client";
import useRelayerStatusHandler from "@/hooks/useRelayerStatusHandler";
import {
  useAgentGetStakeAmount,
  useHubDelegate,
  useHubSwitchDelegate,
  useRelayerDelegate,
  useRelayerGetStatus,
  useRelayerSwitchHub,
} from "@/sdk";
import { Agent1ContractErrorCode } from "@/sdk/utils/script";
import { mindnet, mindtestnet } from "@/sdk/wagimConfig";
import useAgentGetTokenIdStore from "@/store/useAgentGetTokenId";
import { judgeUseGasless, secondsToHours } from "@/utils/utils";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { Button, message, Modal, notification } from "antd";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import { useAccount } from "wagmi";

const successTip = "Agent training has successfully started !";

const StartConfirmModal = forwardRef(
  (
    {
      refreshLearningId,
      refreshHubAgentCount,
      learningId,
      subnetList,
    }: {
      refreshLearningId: Function;
      refreshHubAgentCount: Function;
      learningId?: number;
      subnetList?: any[];
    },
    ref
  ) => {
    const { chainId } = useAccount();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentHub, setCurrentHub] = useState<SubnetInfoType>();
    const { runAsync: hubDelegate, loading } = useHubDelegate({
      waitForReceipt: true,
    });
    const { runAsync: hubDelegateSwitch, loading: delegateLoading } =
      useHubSwitchDelegate({
        waitForReceipt: true,
      });
    const agentTokenId = useAgentGetTokenIdStore((state) => state.agentTokenId);
    const { data: agentStakeAmount } = useAgentGetStakeAmount({
      tokenId: agentTokenId,
    });
    const { runAsync: relayerDelegate } = useRelayerDelegate();
    const { runAsync: relayerSwitchHub } = useRelayerSwitchHub();
    const {
      data: status,
      run: statusRun,
      cancel: statusCancel,
    } = useRelayerGetStatus("delegate");
    const {
      data: statusSwitch,
      run: statusRunSwitch,
      cancel: statusCancelSwitch,
    } = useRelayerGetStatus("switch");
    const [actionLoop, setActionLoop] = useState(false);

    const afterSuccessHandler = () => {
      handleCancel();
      refreshLearningId();
      refreshHubAgentCount();
    };
    useRelayerStatusHandler(
      status,
      statusCancel,
      afterSuccessHandler,
      setActionLoop,
      successTip,
      Agent1ContractErrorCode
    );
    useRelayerStatusHandler(
      statusSwitch,
      statusCancelSwitch,
      afterSuccessHandler,
      setActionLoop,
      successTip,
      Agent1ContractErrorCode
    );

    useImperativeHandle(ref, () => ({
      clickStartConfirmModal: () => {
        setIsModalOpen(true);
      },
      cliskSetCurrentHub: (item: SubnetInfoType) => {
        setCurrentHub(item);
      },
    }));

    const handleCancel = () => {
      setIsModalOpen(false);
    };
    const delegate = async () => {
      let res = null;
      if (agentStakeAmount !== "0") {
        //switch
        if (learningId) {
          if (judgeUseGasless(chainId)) {
            try {
              setActionLoop(true);
              const resId = await relayerSwitchHub(
                agentTokenId,
                currentHub?.subnetId!,
                Boolean(currentHub?.needSign!)
              );
              if (resId) {
                statusRunSwitch(chainId, resId);
              }
            } catch (error) {
              setActionLoop(false);
            }
          } else {
            res = await hubDelegateSwitch({
              tokenId: agentTokenId,
              hubId: currentHub?.subnetId!,
              needSign: Boolean(currentHub?.needSign!),
              chainId: chainId!,
            });
          }
        } else {
          if (judgeUseGasless(chainId)) {
            try {
              setActionLoop(true);
              const resId = await relayerDelegate(
                agentTokenId,
                currentHub?.subnetId!,
                Boolean(currentHub?.needSign!)
              );
              if (resId) {
                statusRun(chainId, resId);
              }
            } catch (error) {
              setActionLoop(false);
            }
          } else {
            res = await hubDelegate({
              tokenId: agentTokenId,
              hubId: currentHub?.subnetId!,
              needSign: Boolean(currentHub?.needSign!),
              chainId: chainId!,
            });
          }
        }
        if (res) {
          afterSuccessHandler();
          notification.success({
            message: "Success",
            description: successTip,
          });
        }
      } else {
        message.open({
          type: "warning",
          content: `The amount in your agent is 0 and you can't start`,
          duration: 5,
        });
      }
    };

    return (
      <Modal
        title="Confirm Your Action"
        open={isModalOpen}
        onCancel={handleCancel}
        className="mind-madal"
        footer={null}
      >
        <div>
          <div className="text-[12px] font-[600] mt-[10px]">
            Hub training Lock-up* :{" "}
            {currentHub?.lockup && secondsToHours(currentHub?.lockup)} H
          </div>
          <div className="text-[12px] font-[400] leading-[180%] mt-[20px]">
            {learningId
              ? `This action will Pause your agent in ${
                  subnetList?.find((item) => item.id === learningId)?.name
                } Hub and continue
        ${currentHub?.type === 0 ? "training" : "working"} with ${
                  currentHub?.subnetName
                } Hub`
              : `
        This action will start ${
          currentHub?.type === 0 ? "training" : "working"
        } your agent with ${currentHub?.subnetName} Hub`}
          </div>
        </div>
        <div className="flex mt-[40px] gap-[20px]">
          <Button
            type="primary"
            className="button-brand-border-white-font"
            onClick={delegate}
            loading={
              learningId ? delegateLoading || actionLoop : loading || actionLoop
            }
          >
            Confirm
          </Button>
          <Button
            type="primary"
            className="button-white-border-white-font"
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </div>
      </Modal>
    );
  }
);

StartConfirmModal.displayName = "StartConfirmModal";
export default StartConfirmModal;
