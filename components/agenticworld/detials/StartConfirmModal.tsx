"use client";
import { useHubDelegate } from "@/sdk";
import useAgentGetTokenIdStore from "@/store/useAgentGetTokenId";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { Button, Modal } from "antd";
import React, { forwardRef, useImperativeHandle, useState } from "react";

const StartConfirmModal = forwardRef(
  (
    {
      refreshLearningId,
      learningId,
    }: { refreshLearningId: Function; learningId?: number },
    ref
  ) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentHub, setCurrentHub] = useState<SubnetInfoType>();
    const { runAsync: hubDelegate, loading } = useHubDelegate();
    const agentTokenId = useAgentGetTokenIdStore((state) => state.agentTokenId);

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
      await hubDelegate({
        tokenId: agentTokenId,
        hubId: currentHub?.subnetId!,
        needSign: Boolean(currentHub?.needSign!),
      });
      handleCancel();
      refreshLearningId();
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
            Hub learning Lock-up* : {currentHub?.lockup} H
          </div>
          <div className="text-[12px] font-[400] leading-[180%] mt-[20px]">
            {learningId
              ? `This action will Pause your agent in [previous] Hub and continue
        learning with ${currentHub?.subnetName} Hub`
              : `
        This action will start your agent's
        learning with ${currentHub?.subnetName} Hub`}
          </div>
        </div>
        <div className="flex mt-[40px] gap-[20px]">
          <Button
            type="primary"
            className="button-white-border-white-font"
            onClick={delegate}
            loading={loading}
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
