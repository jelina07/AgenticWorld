"use client";
import { Button, Modal } from "antd";
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

const StartConfirmModal = forwardRef(
  ({ learningId }: { learningId: number }, ref) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    useImperativeHandle(ref, () => ({
      clickStartConfirmModal: () => {
        setIsModalOpen(true);
      },
    }));

    const handleCancel = () => {
      setIsModalOpen(false);
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
            Hub learning Lock-up* : 72 H
          </div>
          <div className="text-[12px] font-[400] leading-[180%] mt-[20px]">
            {learningId
              ? `This action will Pause your agent in [previous] Hub and continue
        learning with [current] Hub`
              : `
        This action will start your agent&apos;s
        learning with [current] Hub`}
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
    );
  }
);

StartConfirmModal.displayName = "StartConfirmModal";
export default StartConfirmModal;
