import { Modal } from "antd";
import { useEffect, useState } from "react";
import AirDropStakeSuccessShow from "./AirDropStakeSuccessShow";
import useControlModal from "@/store/useControlModal";

export default function AirDropStakeSuccessModal({
  refreshStakeAmount,
  agentStakeAmount,
}: {
  refreshStakeAmount: Function;
  agentStakeAmount?: string;
}) {
  const { airdropSuccessModalopen, setIsAirdropSuccessModalopen } =
    useControlModal();

  const handleCancel = () => {
    setIsAirdropSuccessModalopen(false);
  };

  return (
    <>
      <Modal
        title="Success! Your Agent Is Live"
        open={airdropSuccessModalopen}
        onCancel={handleCancel}
        className="mind-madal"
        footer={null}
      >
        <AirDropStakeSuccessShow></AirDropStakeSuccessShow>
      </Modal>
    </>
  );
}
