"use client";
import { useAirdropCexRegister, useAirdropCheck } from "@/sdk";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import {
  Button,
  Checkbox,
  CheckboxProps,
  Drawer,
  Input,
  message,
  notification,
  Select,
} from "antd";
import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import CEXConfirmModal from "./CEXConfirmModal";
import { formatEther } from "viem";
import { numberDigitsNoMillify } from "@/utils/utils";
import MindConfirmModal from "./MindConfirmModal";

const cexInfo = [
  {
    value: "Bitget",
    label: "Bitget",
    logo: "/icons/bitget-circle-logo.svg",
    img: "/icons/bitget-logo.svg",
    learnMore:
      "https://docs.google.com/document/d/1YkTTWY3tOsnjjcve44tu-jRMyDq2K0ICCMBQsKPt7fs/mobilebasic#heading=h.8qfw0bt1eobs",
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
    createAccount:
      "https://passport.hashkey.com/en-US/register?passport=global",
  },
  {
    value: "Ourbit",
    label: "Ourbit",
    logo: "/images/ourbit-circle-logo.jpeg",
    img: "/images/ourbit-logo.png",
    learnMore:
      "https://docs.google.com/document/d/10bGKvtXDKOV3OdAZzGOVhQUAjaU-KLps6wSB1_AmpLA/edit?tab=t.0#heading=h.6swp0s2s6ve5",
    createAccount: "",
  },
];

export default function EligibilityPreDeposit() {
  const { address, isConnected } = useAccount();
  const {
    data: claimAmout,
    runAsync: checkEligibility,
    loading,
  } = useAirdropCheck();

  const { openConnectModal } = useConnectModal();
  const [isCEXOpen, setIsCEXOpen] = useState(false);
  const [isMindOpen, setIsMindOpen] = useState(false);
  const [currentCEX, setCurrentCEX] = useState({
    value: "Bitget",
    label: "Bitget",
    logo: "/icons/bitget-circle-logo.svg",
    img: "/icons/bitget-logo.svg",
    learnMore:
      "https://docs.google.com/document/d/1YkTTWY3tOsnjjcve44tu-jRMyDq2K0ICCMBQsKPt7fs/mobilebasic#heading=h.8qfw0bt1eobs",
    createAccount: "https://bitget.onelink.me/XqvW?af_xp=custom&pid=PRELSTFHE",
  });
  const [uid, setUid] = useState("");
  const [cexAddress, setCexAddress] = useState("");

  const [isSubmit, setIsSubmit] = useState(false);
  const [isMindSubmit, setIsMindSubmit] = useState(false);
  const [privacy, setPrivacy] = useState(false);

  const showDrawer = async () => {
    setIsCEXOpen(true);
  };
  const onClose = () => {
    setIsCEXOpen(false);
  };

  const showMindDrawer = async () => {
    setIsMindOpen(true);
  };
  const onMindClose = () => {
    setIsMindOpen(false);
  };

  const clickCheckEligibility = async () => {
    if (isConnected && address) {
      if (privacy) {
        const res = await checkEligibility(address);
      } else {
        message.open({
          type: "warning",
          content: `To check eligibility, please agree to the Terms & Conditions and Privacy Policy.`,
          duration: 5,
        });
      }
    } else {
      openConnectModal?.();
    }
  };

  const handleChange = (value: string) => {
    const cex = cexInfo.find((item) => item.value === value)!;
    setCurrentCEX(cex);
  };

  const changIsSubmit = (value: boolean) => {
    setIsSubmit(value);
  };
  const changMindIsSubmit = (value: boolean) => {
    setIsMindSubmit(value);
  };

  const termsChange: CheckboxProps["onChange"] = (e) => {
    console.log(`checked = ${e.target.checked}`);
    setPrivacy(e.target.checked);
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
        <div className="text-center text-[14px] text-[var(--mind-brand)]">
          Checkout Our{" "}
          <a
            href="https://docs.mindnetwork.xyz/minddocs/other/airdrop-user-guide"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[14px] text-[var(--mind-brand)] hover:text-[var(--mind-brand)] underline hover:underline"
          >
            User Guide
          </a>{" "}
          or Provide Your{" "}
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSdnC97a2gTJZcWip1zV0MItZyDi5uYMHkrVRYqQXg4hNy8HKw/viewform"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[14px] text-[var(--mind-brand)] hover:text-[var(--mind-brand)] underline hover:underline"
          >
            Feedback
          </a>
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
            <div
              className={`mind-checkbox mt-[15px] ${
                isConnected ? "" : "hidden"
              }`}
            >
              <Checkbox onChange={termsChange} disabled={claimAmout?.amount}>
                <span className="text-white text-[14px]">
                  You agree to the{" "}
                </span>
                <a
                  href="https://docs.mindnetwork.xyz/minddocs/security-and-privacy/mind-network-airdrop-terms-of-service"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-white text-[14px] underline hover:underline inline-block"
                >
                  Terms & Conditions
                </a>
                <span className="text-white text-[14px]">
                  {" "}
                  and confirm you have read and understand the{" "}
                </span>
                <a
                  href="https://docs.mindnetwork.xyz/minddocs/security-and-privacy/mind-network-airdrop-privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-white text-[14px] underline hover:underline"
                >
                  Privacy Policy
                </a>
              </Checkbox>
            </div>

            <div className="sm:flex justify-between gap-[10px] items-center mt-[10px] mind-input ">
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
              <div>
                <Button
                  type="primary"
                  className="button-brand-border sm:mt-[0px] mt-[10px] mr-[10px]"
                  style={{ height: "38px", width: "130px" }}
                  disabled={claimAmout?.amount}
                  onClick={clickCheckEligibility}
                  loading={loading}
                >
                  Check Eligibility
                </Button>
              </div>
            </div>
            {loading ? (
              <div className="text-[12px] text-[var(--mind-grey)] font-[600] mt-[10px]">
                Checking Eligibility...
              </div>
            ) : claimAmout !== undefined && !claimAmout?.amount ? (
              <div className="text-[12px] text-[var(--mind-red)] font-[600] mt-[10px]">
                Sorry, this wallet is not eligible for the airdrop, please
                switch wallet
              </div>
            ) : (
              ""
            )}
          </div>
        </div>

        {claimAmout?.amount ? (
          <div className="p-[24px] mt-[50px] rounded-[8px] bg-[url('/images/vhe-claim-bg.png')] bg-center bg-cover relative">
            <div className="text-[18px] font-[900]">
              Congratulations! You&apos;re Eligible
            </div>
            <div className="sm:flex justify-between flex-wrap gap-[10px] items-end">
              <div className="flex-[2]">
                <div className="text-[var(--mind-grey)] text-[12px] mt-[5px]">
                  We prepared three options for you to claim on the Airdrop day
                  !
                </div>
                <div className="bg-[rgba(255,255,255,0.05)] p-[10px] mt-[18px] text-center rounded-[10px] h-[131px] flex items-center justify-center">
                  <div>
                    <div className="text-[30px] text-[var(--mind-brand)] font-[700] break-all sm:break-normal">
                      {numberDigitsNoMillify(
                        formatEther(BigInt(claimAmout?.amount))
                      ) + " "}
                      $FHE
                    </div>
                    <div className="text-white text-[12px] mt-[10px] font-[600]">
                      {claimAmout?.register?.cexName === "MindChain" ||
                      isMindSubmit
                        ? "You have chosen MindChain to claim $FHE for the airdrop"
                        : (claimAmout?.register?.cexName &&
                            claimAmout?.register.cexName !== "MindChain") ||
                          isSubmit
                        ? "You have chosen to pre-deposit $FHE to CEX for the airdrop"
                        : "$FHE will be claimable on BSC chain by default when the claim is open"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 w-full min-w-[215px] bg-[rgba(255,255,255,0.05)] text-center rounded-[10px] h-[131px] flex items-center justify-center p-[10px] mt-[18px]">
                {claimAmout?.register?.cexName === "MindChain" ||
                isMindSubmit ? (
                  <div>
                    <Button
                      type="primary"
                      className="button-brand-border"
                      style={{ height: "38px", width: "130px" }}
                      disabled={true}
                    >
                      Claim $FHE
                    </Button>
                    <div className="text-[12px] text-white">
                      Open on Airdrop day
                    </div>
                  </div>
                ) : (claimAmout?.register?.cexName &&
                    claimAmout?.register.cexName !== "MindChain") ||
                  isSubmit ? (
                  <div>
                    <div className="text-[12px] font-[600] leading-[1.2]">
                      $FHE will be sent to your entered account automatically
                      during the airdrop.
                    </div>
                    <div
                      className="text-[12px] font-[600] text-[var(--mind-brand)] cursor-pointer mt-[10px]"
                      onClick={showDrawer}
                    >
                      Check my submitted info →
                    </div>
                  </div>
                ) : (
                  <div>
                    <div>
                      <span className="text-[12px] font-[600] leading-[1.2] inline-block">
                        If you DON&apos;T prefer to claim on BSC Chain, other
                        options:
                      </span>
                    </div>
                    <div className="mt-[10px]">
                      <div
                        className="text-[12px] font-[600] text-[var(--mind-brand)] cursor-pointer"
                        onClick={showMindDrawer}
                      >
                        Claim on MindChain (0 Gas) →
                      </div>
                      <div
                        className="text-[12px] font-[600] text-[var(--mind-brand)] cursor-pointer "
                        onClick={showDrawer}
                      >
                        Pre-Deposit to CEX →
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <Drawer
              title={
                <div className="text-white">
                  <span onClick={onMindClose} className="cursor-pointer">
                    {"<"}
                  </span>
                  <span className="text-[20px] font-[900] ml-[10px]">
                    Claim $FHE on MindChain with 0 Gas Fee
                  </span>
                </div>
              }
              closable={false}
              open={isMindOpen}
              getContainer={false}
              rootClassName="mind-drawer"
              autoFocus={false}
            >
              <div>
                <div className="text-[14px] text-white font-[600] p-[10px] mt-[20px]">
                  Once confirm, you&apos;ll be able to claim $FHE on MindChain
                  when Airdrop. <br></br>This action is irreversible.
                </div>
                <div className="text-right">
                  <MindConfirmModal
                    registerInfo={claimAmout?.register}
                    changIsSubmit={changMindIsSubmit}
                  />
                </div>
              </div>
            </Drawer>
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
              <span className="text-[20px] font-[900] ml-[10px]">
                Pre-Deposit $FHE to CEX with 0 Gas Fee
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
            <div className="pb-[15px] px-[10px] flex justify-between gap-[10px] items-center flex-wrap">
              {cexInfo.map((item) => (
                <div key={item.label}>
                  <img src={item.img} alt="cex" className="h-[35px]" />
                  {item.label === "Bitget" ? (
                    <div className="text-[9px] text-right text-[#66ddfb] leading-[9px]">
                      50 ~ 1000 $FHE<br></br>1.4M in total, FCFS!
                    </div>
                  ) : item.label === "Ourbit" ? (
                    <div className="text-[9px] text-right text-[#5ea976] leading-[9px]">
                      Earn 10% Extra from<br></br>200,000 $FHE Pool
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mind-select my-[10px]">
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
                disabled={isSubmit || claimAmout?.register}
              />
            </div>
            <a
              href={currentCEX.learnMore}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-[var(--mind-brand)] hover:text-[var(--mind-brand)] hover:underline font-[600] underline text-[12px] ${
                currentCEX.learnMore !== "" ? "" : "hidden"
              }`}
            >
              How to find {currentCEX.label} UID and $FHE deposit address ?
            </a>
            <div className="pl-[30px] pr-[10px] mind-input mt-[30px]">
              <div className="sm:flex items-center">
                <span className="text-[16px] font-[600] text-white inline-block min-w-[150px] sm:mb-[0px] mb-[5px]">
                  UID
                </span>
                <Input
                  value={
                    claimAmout?.register ? claimAmout.register.cexUuid : uid
                  }
                  onChange={(e: any) => {
                    setUid(e.target.value.trim());
                  }}
                  style={{ height: "35px" }}
                  disabled={isSubmit || claimAmout?.register}
                />
              </div>
              <div className="sm:flex mt-[30px] items-center">
                <span className="text-[16px] font-[600] text-white inline-block min-w-[150px] sm:mb-[0px] mb-[5px]">
                  Deposit Address
                </span>
                <Input
                  value={
                    claimAmout?.register
                      ? claimAmout.register.cexAddress
                      : cexAddress
                  }
                  onChange={(e: any) => {
                    setCexAddress(e.target.value.trim());
                  }}
                  style={{ height: "35px" }}
                  disabled={isSubmit || claimAmout?.register}
                />
              </div>
            </div>
            <div className="sm:flex items-end justify-end mt-[25px]">
              {/* <span className="text-[var(--mind-grey)] text-[12px]">
                Each CEX account can be linked to a maximum of 10 wallets.
              </span> */}
              <a
                href={currentCEX.createAccount}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-[12px] text-[var(--mind-grey)] hover:text-[var(--mind-grey)] hover:underline underline block mt-[10px] ${
                  currentCEX.createAccount !== "" ? "" : "hidden"
                }`}
              >
                Create {currentCEX.label} Account
              </a>
              <div className="ml-[10px]">
                <CEXConfirmModal
                  uid={uid}
                  cexAddress={cexAddress}
                  currentCex={currentCEX}
                  changIsSubmit={changIsSubmit}
                  registerInfo={claimAmout?.register}
                />
              </div>
            </div>
          </div>
        </Drawer>
      </div>
    </div>
  );
}
