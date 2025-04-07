"use client";
import useRelayerStatusHandler from "@/hooks/useRelayerStatusHandler";
import {
  useAirdropCheck,
  useAirdropClaim,
  useAirdropIsClaimed,
  useAirdropRelayerClaim,
  useRelayerGetStatus,
} from "@/sdk";
import { AirdropContractErrorCode } from "@/sdk/utils/script";
import { cexInfo, numberDigitsNoMillify } from "@/utils/utils";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAsyncEffect } from "ahooks";
import { Button, notification } from "antd";
import Link from "next/link";
import React, { useState } from "react";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import CEXDrawer from "./CEXDrawer";

const successTip = "Claim Success !";

export default function Eligibility() {
  const { address, isConnected, chainId } = useAccount();
  const [claimed, setClaimed] = useState(false);

  const {
    data: claimAmout,
    runAsync: checkEligibility,
    loading,
  } = useAirdropCheck();
  console.log("claimAmout", claimAmout);
  const {
    data: claimedByContract,
    runAsync: airdropIsClaimed,
    refresh: refreshIsClaimed,
  } = useAirdropIsClaimed();

  const { runAsync: claimAsync, loading: claimLoading } = useAirdropClaim({
    waitForReceipt: true,
  });
  const { openConnectModal } = useConnectModal();

  const { runAsync: mindAirdropRelay } = useAirdropRelayerClaim();
  const {
    data: status,
    run: statusRun,
    cancel: statusCancel,
  } = useRelayerGetStatus("claim");
  const [actionLoop, setActionLoop] = useState(false);
  const clickCheckEligibility = async () => {
    if (isConnected && address) {
      await checkEligibility(address);
    } else {
      openConnectModal?.();
    }
  };

  const clickClaim = async () => {
    if (claimAmout?.register?.cexName === "MindChain") {
      try {
        setActionLoop(true);
        const resId = await mindAirdropRelay();
        if (resId) {
          statusRun(chainId, resId);
        } else {
          setActionLoop(false);
        }
      } catch (error) {
        setActionLoop(false);
      }
    } else {
      const res = await claimAsync(
        formatEther(BigInt(claimAmout.amount)),
        claimAmout.proof
      );
      if (res) {
        afterSuccessHandler();
        notification.success({
          message: "Success",
          description: successTip,
        });
      }
    }
  };

  const afterSuccessHandler = () => {
    refreshIsClaimed();
  };

  useRelayerStatusHandler(
    status,
    statusCancel,
    afterSuccessHandler,
    setActionLoop,
    successTip,
    AirdropContractErrorCode
  );

  useAsyncEffect(async () => {
    if (claimAmout) {
      if (
        claimAmout.register?.cexName &&
        claimAmout.register.cexName !== "MindChain"
      ) {
        setClaimed(true);
      } else if (
        claimAmout.register?.cexName &&
        claimAmout.register?.cexName === "MindChain"
      ) {
        await airdropIsClaimed("MindChain");
      } else {
        await airdropIsClaimed("Bsc");
      }
    }
  }, [claimAmout]);

  return (
    <div>
      <div>
        <div className="text-[24px] sm:text-[40px] text-center font-[800] pt-[30px]">
          Mind Network Airdrop
        </div>
        <div className="text-[14px] text-center mt-[10px]">
          Check your eligibility and claim $FHE tokens
        </div>
        <div className="text-center">
          <a
            href="http://"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[14px] text-[var(--mind-brand)] hover:text-[var(--mind-brand)] underline hover:underline"
          >
            Checkout Our User Guide or Provide Your Feedback
          </a>
        </div>
      </div>
      <div className="relative">
        <div
          className="p-[24px] mt-[50px] rounded-[8px] bg-[url('/images/check-eligibility-bg.png')]
                  bg-center bg-cover opacity-90"
        >
          <div className="text-[20px] font-[900] capitalize ">
            Check Eligibility
          </div>
          <div className="mt-[20px]">
            <div className="text-[15px] font-[700]">Enter Wallet Address</div>
            <div className="sm:flex justify-between gap-[10px] items-center mt-[15px] mind-input">
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
                disabled={claimAmout?.amount}
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
          <div className="p-[24px] mt-[50px] rounded-[8px] bg-[url('/images/vhe-claim-bg.png')] bg-center bg-cover">
            <div className="text-[18px] font-[900]">
              Congratulations! You&apos;re Eligible
            </div>
            <div className="flex justify-between gap-[10px] items-end flex-wrap">
              <div className="flex-1">
                <div className="text-[var(--mind-grey)] text-[12px] mt-[5px]">
                  You can claim the following amount:
                </div>
                <div className="text-[30px] text-[var(--mind-brand)] font-[700] mt-[20px] min-w-[300px] bg-[rgba(255,255,255,0.05)] flex justify-center rounded-[10px] py-[30px] px-[10px]">
                  <div className="text-center">
                    {numberDigitsNoMillify(
                      formatEther(BigInt(claimAmout?.amount))
                    ) + " "}
                    $FHE
                    <div
                      className={`text-[12px] font-[600] text-white ${
                        claimAmout?.register?.cexName &&
                        claimAmout?.register.cexName !== "MindChain"
                      } ? '' : 'hidden'`}
                    >
                      $FHE will be auto-credited to your submitted CEX account.
                    </div>
                  </div>
                </div>
              </div>
              {claimAmout?.register?.cexName &&
              claimAmout?.register.cexName !== "MindChain" ? (
                <div className="flex-1">
                  <div className="text-center text-[12px] leading-[12px]">
                    You can now launch your Agent with your $FHE to start
                    earning more $FHE
                  </div>
                  <Button
                    type="primary"
                    className="button-brand-border mt-[10px]"
                    onClick={clickClaim}
                  >
                    Launch Your Agent
                  </Button>
                  <CEXDrawer claimAmout={claimAmout} />
                </div>
              ) : (
                <div className="flex items-end pb-[10px] flex-1 justify-around">
                  <div className="w-[135px]">
                    <div className="text-[12px] text-center leading-[12px]">
                      {claimAmout?.register?.cexName === "MindChain"
                        ? "Claim $FHE on MindChain"
                        : "Claim $FHE on BNB Smart Chain"}
                    </div>
                    <Button
                      type="primary"
                      className="button-brand-border mt-[10px]"
                      onClick={clickClaim}
                    >
                      Claim $FHE
                    </Button>
                  </div>
                  <div className="w-[135px]">
                    <div className="text-[12px] text-center leading-[12px]">
                      Launch Agent instantly to earn more $FHE
                    </div>
                    <Button
                      type="primary"
                      className="button-brand-border mt-[10px]"
                    >
                      Claim & Stake
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
