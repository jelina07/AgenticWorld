"use client";
import { useAirdropCheck, useAirdropClaim } from "@/sdk";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { Button, Drawer, Input, message, Select } from "antd";
import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import CEXConfirmModal from "./CEXConfirmModal";

const cexInfo = [
  {
    value: "Bitget",
    label: "Bitget",
    logo: "/icons/bitget-circle-logo.svg",
    img: "/icons/bitget-logo.svg",
    learnMore: "",
    createAccount: "https://bitget.onelink.me/XqvW?af_xp=custom&pid=PRELSTFHE",
  },
  {
    value: "Gate.io",
    label: "Gate.io",
    logo: "/images/gate-circle-logo.jpeg",
    img: "/icons/gate-logo.svg",
    learnMore: "",
    createAccount: "",
  },
  {
    value: "HASHKEY",
    label: "HASHKEY",
    logo: "/icons/hashkey-circle-logo.svg",
    img: "/icons/hashkey-logo.svg",
    learnMore: "",
    createAccount: "",
  },
  {
    value: "Ourbit",
    label: "Ourbit",
    logo: "/images/ourbit-circle-logo.jpeg",
    img: "/icons/bitget-logo.svg",
    learnMore: "",
    createAccount: "",
  },
];

export default function EligibilityPreDeposit() {
  const { address, isConnected } = useAccount();
  const {
    data: claimAmout,
    runAsync: checkEligibility,
    loading,
  } = useAirdropCheck(); // number
  const { runAsync: claim } = useAirdropClaim({ waitForReceipt: true });
  console.log("claimAmout", claimAmout);
  const { openConnectModal } = useConnectModal();
  const [isCEXOpen, setIsCEXOpen] = useState(false);
  const [currentCEX, setCurrentCEX] = useState({
    value: "Bitget",
    label: "Bitget",
    logo: "/icons/bitget-circle-logo.svg",
    img: "/icons/bitget-logo.svg",
    learnMore: "",
    createAccount: "",
  });
  const [uid, setUid] = useState("");
  const [cexAddress, setCexAddress] = useState("");

  const showDrawer = () => {
    setIsCEXOpen(true);
  };

  const onClose = () => {
    setIsCEXOpen(false);
  };

  const clickCheckEligibility = async () => {
    if (isConnected && address) {
      const res = await checkEligibility(address);
    } else {
      openConnectModal?.();
    }
  };

  const clickClaim = async () => {
    message.open({
      type: "warning",
      content: ` !`,
      duration: 5,
    });
  };

  const handleChange = (value: string) => {
    const cex = cexInfo.find((item) => item.value === value)!;
    setCurrentCEX(cex);
  };

  return (
    <div>
      <div>
        <div className="text-[24px] sm:text-[40px] text-center font-[800] pt-[30px]">
          Mind Network Airdrop
        </div>
        <div className="text-[14px] text-center mt-[10px]">
          Check your eligibility and claim $FHE tokens
        </div>
      </div>

      <div className="relative">
        <div
          className={`p-[24px] mt-[50px] rounded-[8px] bg-[url('/images/check-eligibility-bg.png')]
                  bg-center bg-cover opacity-90`}
        >
          <div className="text-[20px] font-[900] capitalize ">
            Check Eligibility
          </div>
          <div className="mt-[20px]">
            <div className="text-[15px] font-[700]">Enter Wallet Address</div>
            <div className="sm:flex justify-between gap-[10px] items-center mt-[15px] mind-input ">
              <div
                className="px-[11px] py-[8px] flex-1 flex items-center
                            bg-[#181818] rounded-[10px] border-[length:var(--border-width)] border-[var(--btn-border)]"
              >
                <div className="flex justify-between items-center gap-[5px]">
                  <div className="flex justify-between items-center gap-[5px]">
                    <img src="/icons/wallet-logo.svg"></img>
                    <span className="text-[14px] break-all">{address}</span>
                  </div>
                </div>
              </div>
              <Button
                type="primary"
                className="button-brand-border sm:mt-[0px] mt-[10px]"
                style={{ height: "38px", width: "130px" }}
                disabled={!address}
                onClick={clickCheckEligibility}
                loading={loading}
              >
                Check Eligibility
              </Button>
            </div>
            {loading ? (
              <div className="text-[12px] text-[var(--mind-grey)] font-[600] mt-[10px]">
                Checking Eligibility...
              </div>
            ) : claimAmout !== undefined && !claimAmout ? (
              <div className="text-[12px] text-[var(--mind-red)] font-[600] mt-[10px]">
                Sorry, this wallet is not eligible for the airdrop, Please
                switch wallet
              </div>
            ) : (
              ""
            )}
          </div>
        </div>

        {true ? (
          <div className="p-[24px] mt-[40px] rounded-[8px] bg-[url('/images/vhe-claim-bg.png')] bg-center bg-cover">
            <div className="text-[18px] font-[900]">
              Congratulations! You&apos;re Eligible
            </div>
            <div className="flex justify-between flex-wrap gap-[10px] items-end">
              <div>
                <div className="text-[var(--mind-grey)] text-[12px] mt-[5px]">
                  You can claim the following amount:
                </div>
                <div className="text-[30px] text-[var(--mind-brand)] font-[700] mt-[20px] ">
                  {claimAmout}$FHE
                </div>
                <div className="text-[var(--mind-grey)] text-[12px] mt-[10px]">
                  Make sure you&apos;re connected to MindChain before claiming!
                </div>
              </div>
              <div className="w-[190px]">
                <div className="p-[5px] bg-[#19201d] rounded-[5px] text-center">
                  <span className="text-[12px] font-[600] leading-[1.1] inline-block">
                    Prefer to claim on MindChain when TGE :
                  </span>
                  <Button
                    type="primary"
                    className="button-brand-border mt-[5px]"
                    style={{ height: "38px", width: "130px" }}
                    onClick={clickClaim}
                    disabled={true}
                  >
                    Confirm
                  </Button>
                </div>
                <div>
                  <span
                    className="text-[12px] font-[600] text-[var(--mind-brand)] cursor-pointer"
                    onClick={showDrawer}
                  >
                    Prefer to Pre-Deposit to CEX →
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
        <Drawer
          title={
            <div className="text-white">
              <span onClick={onClose} className="cursor-pointer">
                {"<"}
              </span>
              <span className="text-[18px] font-[900] ml-[10px]">
                Pre-Deposit $FHE to CEX ! - 0 gas fee
              </span>
            </div>
          }
          closable={false}
          open={isCEXOpen}
          getContainer={false}
          rootClassName="mind-drawer"
          autoFocus={false}
        >
          <div>
            <div className="pb-[10px] px-[10px] flex justify-between gap-[10px] items-center flex-wrap">
              {cexInfo.map((item) => (
                <img src={item.img} alt="cex" height={40} />
              ))}
            </div>
            <div className="flex justify-between items-center mind-select">
              <span className="font-[600] items-center text-white text-[16px]">
                Select the Exchange
              </span>
              <Select
                prefix={
                  <img
                    src={currentCEX.logo}
                    width={20}
                    className="rounded-[50%]"
                  />
                }
                defaultValue="Bitget"
                onChange={handleChange}
                options={cexInfo}
              />
            </div>
            <div className="text-white font-[600] mb-[10px]">
              Fill the relevant information to ensure successful sending
            </div>
            <a
              href={currentCEX.learnMore}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--mind-brand)] hover:text-[var(--mind-brand)] hover:underline font-[600] underline"
            >
              How to find {currentCEX.label} UID and $FHE deposit address ?
            </a>
            <div className="p-[10px] mind-input mt-[10px]">
              <div className="sm:flex items-center">
                <span className="text-[16px] font-[600] text-white inline-block min-w-[150px] sm:mb-[0px] mb-[5px]">
                  UID
                </span>
                <Input
                  value={uid}
                  onChange={(e: any) => {
                    setUid(e.target.value);
                  }}
                />
              </div>
              <div className="sm:flex mt-[10px] items-center">
                <span className="text-[16px] font-[600] text-white inline-block min-w-[150px] sm:mb-[0px] mb-[5px]">
                  Deposit Address
                </span>
                <Input
                  value={cexAddress}
                  onChange={(e: any) => {
                    setCexAddress(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="sm:flex items-center justify-between">
              <span className="text-[var(--mind-grey)] text-[12px]">
                Each CEX account can be linked to a maximum of 10 wallets.
              </span>
              <div>
                <CEXConfirmModal
                  uid={uid}
                  cexAddress={cexAddress}
                  currentCex={currentCEX}
                />
                <a
                  href={currentCEX.createAccount}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[12px] text-[var(--mind-grey)] hover:text-[var(--mind-grey)] hover:underline underline block mt-[10px]"
                >
                  Create {currentCEX.label} Account
                </a>
              </div>
            </div>
          </div>
        </Drawer>
      </div>
    </div>
  );
}
