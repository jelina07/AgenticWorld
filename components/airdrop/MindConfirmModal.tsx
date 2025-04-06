import { useAirdropCexRegister } from "@/sdk";
import { Button, message, Modal, notification } from "antd";
import React, { useState } from "react";

export default function MindConfirmModal({
  registerInfo,
  changIsSubmit,
}: {
  registerInfo: any;
  changIsSubmit: Function;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { runAsync: cexRegister, loading } = useAirdropCexRegister();
  const [isSubmit, setIsSubmit] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const clickConfirm = async () => {
    const payload = {
      cexName: "Mind",
      cexAddress: "MindAddress",
      cexUuid: "MindUid",
    } as any;
    const res = await cexRegister(payload);
    if (res) {
      setIsSubmit(true);
      changIsSubmit(true);
      notification.success({
        message: "Success",
        description: "Confirm Success !",
      });
      handleCancel();
    }
  };
  return (
    <>
      <Button
        type="primary"
        className="button-brand-border mt-[15px]"
        style={{ height: "35px", width: "130px" }}
        disabled={isSubmit || registerInfo}
        onClick={showModal}
        loading={loading}
      >
        {loading
          ? "loading..."
          : isSubmit || registerInfo
          ? "Confirmed"
          : "Confirm"}
      </Button>
      <Modal
        title=""
        open={isModalOpen}
        onCancel={handleCancel}
        className="mind-madal"
        footer={null}
      >
        <div>
          <div className="text-[18px] font-[600] mt-[20px]">
            Please confirm your choice to claim $FHE on MindChain.
          </div>
          <div className="flex mt-[40px] gap-[20px]">
            <Button
              type="primary"
              className="button-white-border-white-font"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              className="button-brand-border-white-font"
              onClick={clickConfirm}
              loading={loading}
            >
              Confirm
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
