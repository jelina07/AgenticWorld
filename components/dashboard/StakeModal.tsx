import { Button, Input, Modal } from "antd";
import React, { useState } from "react";
import UpArraw from "@/public/icons/up-arraw.svg";

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
          <Input style={{ height: "46px", marginTop: "20px" }} />
          <div>
            <div className="flex justify-between items-center mt-[20px]">
              <span className="text-[14px] font-[400]">+1000 FHE</span>
              <div className="flex items-center gap-[2px]">
                <span className="text-[14px] font-[500]">rewards earning</span>
                <span className="text-[20px] font-[500] text-[var(--mind-brand)]">
                  ~10%
                </span>
                <UpArraw />
              </div>
            </div>
            <div className="flex justify-between items-center mt-[5px]">
              <span className="text-[14px] font-[400]">+10000 FHE</span>
              <div className="flex items-center gap-[2px]">
                <span className="text-[14px] font-[500]">rewards earning</span>
                <span className="text-[20px] font-[500] text-[var(--mind-brand)]">
                  ~100%
                </span>
                <UpArraw />
              </div>
            </div>
          </div>
          <Button type="primary" className="button-brand-border mt-[30px]">
            Stake
          </Button>
        </div>
      </Modal>
    </>
  );
}
