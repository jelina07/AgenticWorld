import { Button, Input, Modal } from "antd";
import React, { useState } from "react";
import DownArraw from "@/public/icons/down-arraw.svg";

export default function DecreseModal() {
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
        onClick={showModal}
      >
        Decrease
      </Button>
      <Modal
        title="Deduct Your Stake To Agent"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        className="mind-madal"
        footer={null}
      >
        <div className="mind-input">
          <Input style={{ height: "46px", marginTop: "20px" }} />
          <div>
            <div className="flex items-center gap-[2px] justify-end mt-[20px]">
              <span className="text-[14px] font-[500]">rewards earning</span>
              <span className="text-[20px] font-[500] text-[var(--mind-red)]">
                ~10%
              </span>
              <DownArraw />
            </div>
          </div>
          <Button type="primary" className="button-brand-border mt-[30px]">
            Unstake
          </Button>
        </div>
      </Modal>
    </>
  );
}
