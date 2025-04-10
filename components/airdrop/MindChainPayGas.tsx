import { useAirdropClaim, useAirdropIsClaimed, useGetFheBalance } from "@/sdk";
import { Button, notification } from "antd";
import React from "react";

export default function MindChainPayGas({
  claimAmout,
  refreshIsClaimed,
  btnDisabled,
}: {
  claimAmout: any;
  refreshIsClaimed: Function;
  btnDisabled: boolean;
}) {
  const { refresh: fheBalanceRefresh } = useGetFheBalance();
  const { runAsync: claimAsync, loading: claimLoading } = useAirdropClaim({
    waitForReceipt: true,
    mindPayGasSelf: true,
  });

  const afterSuccessHandler = () => {
    refreshIsClaimed();
    fheBalanceRefresh();
  };
  const clickClaim = async () => {
    const proof = JSON.parse(claimAmout.proof);
    const res = await claimAsync(claimAmout.amount, proof);
    if (res) {
      afterSuccessHandler();
      notification.success({
        message: "Success",
        description: "Claim Success !",
      });
    }
  };
  return (
    <Button
      type="primary"
      className="button-brand-border mt-[10px]"
      onClick={clickClaim}
      loading={claimLoading}
      disabled={btnDisabled}
    >
      Claim with gas
    </Button>
  );
}
