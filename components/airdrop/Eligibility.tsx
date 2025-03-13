import { Button, Input } from "antd";
import React from "react";

export default function Eligibility() {
  return (
    <div>
      <div>
        <div className="text-[30px] sm:text-[40px] text-center font-[800] pt-[30px]">
          Mind Network Airdrop
        </div>
        <div className="text-[14px] text-center mt-[10px]">
          Check your eligibility and claim $FHE tokens
        </div>
      </div>
      <div
        className="p-[24px] mt-[50px] rounded-[8px] bg-[url('/images/check-eligibility-bg.png')]
                  bg-center bg-cover opacity-90"
      >
        <div className="text-[20px] font-[900] capitalize ">
          Check Eligibility
        </div>
        <div className="mt-[20px]">
          <div className="text-[15px] font-[700]">Enter Wallet Address</div>
          <div className="flex justify-between gap-[10px] items-center mt-[15px] mind-input">
            <Input
              prefix={<img src="/icons/wallet-logo.svg"></img>}
              style={{ height: "38px" }}
            />
            <Button
              type="primary"
              className="button-brand-border"
              style={{ height: "38px", width: "130px" }}
            >
              Check Eligibility
            </Button>
          </div>
          <div className="text-[12px] text-[var(--mind-grey)] font-[600] mt-[10px]">
            Checking Eligibility...
          </div>
          <div className="text-[12px] text-[var(--mind-red)] font-[600] mt-[10px]">
            Sorry, this wallet is not eligible for the airdrop.
          </div>
        </div>
      </div>
      <div className="p-[24px] mt-[20px] rounded-[8px] bg-[url('/images/vhe-claim-bg.png')] bg-center bg-cover">
        <div className="text-[18px] font-[900]">
          Congratulations! You&apos;re Eligible
        </div>
        <div className="flex justify-between gap-[10px] items-end">
          <div>
            <div className="text-[var(--mind-grey)] text-[12px] mt-[5px]">
              You can claim the following amount:
            </div>
            <div className="text-[30px] text-[var(--mind-brand)] font-[700] mt-[20px] ">
              2400$FHE
            </div>
            <div className="text-[var(--mind-grey)] text-[12px] mt-[10px]">
              Make sure you&apos;re connected to Mindchain before claiming!
            </div>
          </div>
          <Button
            type="primary"
            className="button-brand-border"
            style={{ height: "38px", width: "130px" }}
          >
            Claim $FHE
          </Button>
        </div>
      </div>
    </div>
  );
}
