import { Button, message, Modal } from "antd";
import React, { useState } from "react";

export default function CEXConfirmModal({
  uid,
  cexAddress,
  currentCex,
}: {
  uid: string;
  cexAddress: string;
  currentCex: any;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
  return (
    <>
      <Button
        type="primary"
        className="button-brand-border mt-[15px]"
        style={{ height: "30px", width: "130px" }}
        disabled={uid === "" || cexAddress === ""}
        onClick={confirmClick}
      >
        Confirm
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
                <img src={currentCex.logo} alt="cex-logo" />
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
            <Button type="primary" className="button-brand-border-white-font">
              Submit
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
