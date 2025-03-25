"use client";
import {
  useAgentGetStakeAmount,
  useHubDelegate,
  useHubSwitchDelegate,
} from "@/sdk";
import useAgentGetTokenIdStore from "@/store/useAgentGetTokenId";
import { secondsToHours } from "@/utils/utils";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { Button, message, Modal, notification } from "antd";
import React, { forwardRef, useImperativeHandle, useState } from "react";

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
        if (learningId) {
          res = await hubDelegateSwitch({
            tokenId: agentTokenId,
            hubId: currentHub?.subnetId!,
            needSign: Boolean(currentHub?.needSign!),
          });
        } else {
          res = await hubDelegate({
            tokenId: agentTokenId,
            hubId: currentHub?.subnetId!,
            needSign: Boolean(currentHub?.needSign!),
          });
        }
        if (res) {
          handleCancel();
          refreshLearningId();
          refreshHubAgentCount();
          notification.success({
            message: "Success",
            description: "Agent training has successfully started !",
          });
        }
      } else {
        message.open({
          type: "warning",
          content: `The amount in your agent is 0 and you can't start training`,
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
        training with ${currentHub?.subnetName} Hub`
              : `
        This action will start training your agent with ${currentHub?.subnetName} Hub`}
          </div>
        </div>
        <div className="flex mt-[40px] gap-[20px]">
          <Button
            type="primary"
            className="button-white-border-white-font"
            onClick={delegate}
            loading={learningId ? delegateLoading : loading}
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
      </Modal>
    );
  }
);

StartConfirmModal.displayName = "StartConfirmModal";
export default StartConfirmModal;
