import { useAirdropCexRegister } from "@/sdk";
import { Button, message, Modal, notification } from "antd";
import React, { useState } from "react";

export default function CEXConfirmModal({
  uid,
  cexAddress,
  currentCex,
  registerInfo,
  getRegInfoLoading,
  getRegInfoRefreshAsync,
}: {
  uid: string;
  cexAddress: string;
  currentCex: any;
  registerInfo: any;
  getRegInfoLoading: boolean;
  getRegInfoRefreshAsync: Function;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { runAsync: cexRegister, loading } = useAirdropCexRegister();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const confirmClick = () => {
    if (uid === "" || cexAddress === "") {
      message.open({
        type: "warning",
        content: `Please complete your information !`,
        duration: 5,
      });
    } else {
      showModal();
    }
  };

  const clickSubmit = async () => {
    console.log("currentCex", currentCex);

    const payload = {
      cexName: currentCex.label,
      cexAddress: cexAddress,
      cexUuid: uid,
    };
    console.log("payload", payload);

    const res = await cexRegister(payload);
    if (res) {
      await getRegInfoRefreshAsync();
      notification.success({
        message: "Success",
        description: "Submit Success !",
      });
      handleCancel();
    }
  };
  return (
    <>
      <Button
        type="primary"
        className="button-brand-border mt-[15px]"
        style={{ height: "30px", width: "130px" }}
        disabled={
          uid === "" || cexAddress === "" || registerInfo || getRegInfoLoading
        }
        onClick={confirmClick}
      >
        {getRegInfoLoading
          ? "loading..."
          : !registerInfo
          ? "Submit"
          : "Submitted"}
      </Button>
      <Modal
        title="Confirm your Information"
        open={isModalOpen}
        onCancel={handleCancel}
        className="mind-madal"
        footer={null}
      >
        <div>
          <span className="text-[12px]">
            Please double-check your information. Once submitted,
            <span className="text-[var(--mind-red)]">
              {" "}
              it cannot be changed.
            </span>
          </span>
          <div>
            <div className="flex gap-[15px] mt-[10px]">
              <div>Exchange: </div>
              <div className="text-white flex items-center gap-[5px]">
                <img
                  src={currentCex.logo}
                  alt="cex-logo"
                  width={20}
                  className="rounded-[50%]"
                />
                <span>{currentCex.label}</span>
              </div>
            </div>

            <div className="flex gap-[15px] mt-[10px]">
              <div>UID:</div>
              <div>{uid}</div>
            </div>
            <div className="flex gap-[15px] mt-[10px]">
              <div>Deposit Address:</div>
              <div>{cexAddress}</div>
            </div>
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
              onClick={clickSubmit}
              loading={loading}
            >
              Submit
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
