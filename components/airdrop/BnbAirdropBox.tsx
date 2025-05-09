"use client";
import { Drawer } from "antd";
import { useState } from "react";
import BnbAirdrop from "./BnbAirdrop";

export default function BnbAirdropBox() {
  const [isBNBOpen, setIsBNBOpen] = useState(false);
  const showDrawer = async () => {
    setIsBNBOpen(true);
  };
  const onClose = () => {
    setIsBNBOpen(false);
  };
  return (
    <div>
      <div className="py-[30px] px-[50px] mt-[60px] rounded-[8px] bg-[url('/images/vhe-claim-bg.png')] bg-center bg-cover">
        <div className="text-[18px] font-[900]">
          <span className="text-[var(--mind-brand)]">Mind Network</span> ×{" "}
          <span className="text-[#DEB03D]">BNB Chain</span> Retroactive Rewards
          Claim
        </div>

        <div className="mt-[16px] text-[12px] font-[600] capitalize text-[var(--mind-brand)]">
          Claim Time: May 10th - June 10th
        </div>
        <div className="mt-[20px] text-[14px] font-[600]">
          $FHE rewards for early participants in the BNB Chain campaign Campaign
          Duration: Nov 7, 2023 - Nov 14, 202
        </div>
        <div
          className="text-[14px] font-[600] text-[var(--mind-brand)] cursor-pointer mt-[10px] text-right"
          onClick={showDrawer}
        >
          Click to claim your $FHE rewards →
        </div>
      </div>
      <Drawer
        title={
          <div className="text-white">
            <span onClick={onClose} className="cursor-pointer mr-[10px]">
              {"<"}
            </span>
            <span className="text-[18px] font-[900]">
              <span className="text-[var(--mind-brand)]">Mind Network</span> ×{" "}
              <span className="text-[#DEB03D]">BNB Chain</span> Retroactive
              Rewards Claim
            </span>
          </div>
        }
        closable={false}
        open={isBNBOpen}
        getContainer={false}
        rootClassName="mind-drawer"
        autoFocus={false}
      >
        <div>
          <div>
            <div className="text-[12px] font-[600] capitalize text-[var(--mind-brand)]">
              Claim Time: May 10th - June 10th
            </div>
            <BnbAirdrop />
          </div>
        </div>
      </Drawer>
    </div>
  );
}
