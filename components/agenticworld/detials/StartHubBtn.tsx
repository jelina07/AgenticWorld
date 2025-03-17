"use client";
import { Button, Modal } from "antd";
import React, { useState } from "react";

export default function StartHubBtn({
  subnetId,
  learningId,
  lockTimeReach,
}: {
  subnetId: number;
  learningId: number;
  lockTimeReach: boolean;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <Button
        type="primary"
        className="button-brand-border-white-font"
        disabled={learningId === subnetId || !lockTimeReach}
        onClick={showModal}
      >
        {learningId === subnetId ? "Learning..." : "Start"}
      </Button>
      <Modal
        title="Confirm Your Action"
        open={isModalOpen}
        onCancel={handleCancel}
        className="mind-madal"
        footer={null}
      >
        <div>
          <div className="text-[12px] font-[600] mt-[10px]">
            Hub learning Lock-up* : 72 H
          </div>
          <div className="text-[12px] font-[400] leading-[180%] mt-[20px]">
            This action will Pause your agent in [previous] Hub and continue
            learning with [current] Hub
          </div>
        </div>
        <div className="flex mt-[40px] gap-[20px]">
          <Button type="primary" className="button-white-border-white-font">
            Confirm
          </Button>
          <Button type="primary" className="button-brand-border-white-font">
            Cancel
          </Button>
        </div>
      </Modal>
    </>
  );
}
