"use client";
import { Button, Input, Modal } from "antd";
import React, { useState } from "react";

export default function ShutDownAgent() {
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
      <div
        className="capitalize underline text-[12px] text-[var(--mind-brand)] text-right mt-[10px] cursor-pointer"
        onClick={showModal}
      >
        Permanently Shut Down My Agent?
      </div>
      <Modal
        title="Shut Down Your Agent"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        className="mind-madal"
        footer={null}
      >
        <div className="mind-input">
          <div className="text-[12px] font-[400]">
            This action will permanently shut down your agent and cannot be
            undone. You will lose all access to your current agent.
          </div>
          <div className="text-[12px] font-[400]">Unstaking FHE</div>
          <div
            className=" px-[11px] py-[4px] mt-[15px] h-[45px] flex items-center
                            bg-[#181818] rounded-[10px] border-[length:var(--border-width)] border-[var(--btn-border)]"
          >
            <div className="flex-1 flex justify-between items-center">
              <span className="text-[var(--mind-brand)] text-[14px]">100</span>
              <span className="text-[14px] text-[var(--mind-grey)]">FHE</span>
            </div>
          </div>
          <div className="flex mt-[30px] gap-[20px]">
            <Button type="primary" className="button-white-border-white-font">
              Confirm
            </Button>
            <Button type="primary" className="button-brand-border-white-font">
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
