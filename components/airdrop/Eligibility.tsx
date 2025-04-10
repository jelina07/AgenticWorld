"use client";
import useRelayerStatusHandler from "@/hooks/useRelayerStatusHandler";
import {
  useAgentGetStakeAmount,
  useAgentGetTokenId,
  useAgentStake,
  useAirdropCheck,
  useAirdropClaim,
  useAirdropIsClaimed,
  useAirdropRelayerClaim,
  useGetFheBalance,
  useRelayerGetStatus,
  useRelayerStake,
} from "@/sdk";
import {
  Agent1ContractErrorCode,
  AirdropContractErrorCode,
} from "@/sdk/utils/script";
import {
  bridgeMindgasLink,
  checkAmountControlButtonShow,
  firstStakeAmount,
  getMore$FHE,
  judgeUseGasless,
  numberDigitsNoMillify,
} from "@/utils/utils";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAsyncEffect } from "ahooks";
import { Button, Checkbox, CheckboxProps, message, notification } from "antd";
import Link from "next/link";
import React, { useRef, useState } from "react";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import useAgentGetTokenIdStore from "@/store/useAgentGetTokenId";
import CEXDrawer from "./CEXDrawer";
import MindTip from "../utils/MindTip";
import AirDropStakeModal from "./AirDropStakeModal";
import MindChainPayGas from "./MindChainPayGas";
import { isDev, isProd } from "@/sdk/utils";
import { bnb, bnbtestnet, mindnet, mindtestnet } from "@/sdk/wagimConfig";
import useRelayerClaimStatus from "@/hooks/useRelayerClaimStatus";
import useControlModal from "@/store/useControlModal";
import AirDropStakeSuccessModal from "./AirDropStakeSuccessModal";
import { useLov } from "@/store/useLov";

const successTip = "Claim Success !";
const successTipStake = "Stake Success !";

export default function Eligibility() {
  const [isClaimAndStake, setIsClaimAndStake] = useState(false);
  const { refresh: agentGetTokenIdRefresh } = useAgentGetTokenId();
  const agentTokenId = useAgentGetTokenIdStore((state) => state.agentTokenId);
  const isAgent = agentTokenId !== 0;
  const { address, isConnected, chainId } = useAccount();
  const { refresh: fheBalanceRefresh } = useGetFheBalance();
  const { data: agentStakeAmount, refresh: refreshStakeAmount } =
    useAgentGetStakeAmount({
      tokenId: agentTokenId,
    });

  const {
    data: claimAmout,
    runAsync: checkEligibility,
    loading,
  } = useAirdropCheck();

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

  const {
    data: statusClaim,
    run: statusRunClaim,
    cancel: statusCancelClaim,
  } = useRelayerGetStatus("claim");

  const {
    data: statusStake,
    run: statusRunStake,
    cancel: statusCancelStake,
  } = useRelayerGetStatus("stake");

  const [actionLoop, setActionLoop] = useState(false);
  const [actionLoopStake, setActionLoopStake] = useState(false);
  const { runAsync: relayerAgentStake } = useRelayerStake();
  const { runAsync: agentStake, loading: agentStakeLoading } = useAgentStake({
    waitForReceipt: true,
  });
  const [privacy, setPrivacy] = useState(false);
  const { airdropSuccessModalopen, setIsAirdropSuccessModalopen } =
    useControlModal();
  const { getContractAdress } = useLov();
  const airdropContractAddressHaveNull = getContractAdress().some(
    (item) => item.value === null
  );

  const clickCheckEligibility = async () => {
    if (isConnected && address) {
      if (privacy) {
        await checkEligibility(address);
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

  const clickClaim = async () => {
    setIsClaimAndStake(false);
    if (claimAmout?.register?.cexName === "MindChain") {
      try {
        setActionLoop(true);
        const res = await mindAirdropRelay();
        if (res) {
          statusRun();
        } else {
          setActionLoop(false);
        }
      } catch (error) {
        setActionLoop(false);
      }
    } else {
      const proof = JSON.parse(claimAmout.proof);
      const res = await claimAsync(claimAmout.amount, proof);
      if (res) {
        afterSuccessHandler();
        notification.success({
          message: "Success",
          description: successTip,
        });
      }
    }
  };

  const stake = async (amount: string) => {
    if (checkAmountControlButtonShow(amount)) {
      const judgeCondition = !isAgent
        ? Number(amount) < firstStakeAmount
        : false;
      if (judgeCondition) {
        message.open({
          type: "warning",
          content: (
            <div className="text-[12px]">
              The minimum required amount is ${firstStakeAmount} !{" "}
              <a
                href={getMore$FHE}
                target="_blank"
                rel="noopener noreferrer"
                className="text-(var[--mind-beand]) underline hover:text-(var[--mind-beand]) hover:underline"
              >
                Get More $FHE
              </a>
            </div>
          ),
          duration: 10,
        });
        setIsClaimAndStake(false);
      } else {
        if (judgeUseGasless(chainId)) {
          try {
            setActionLoopStake(true);
            const resId = await relayerAgentStake(agentTokenId!, amount);
            if (resId) {
              statusRunStake(chainId, resId);
            }
          } catch (error: any) {
            setActionLoopStake(false);
            setIsClaimAndStake(false);
          }
        } else {
          try {
            const res = await agentStake(agentTokenId!, amount);
            if (res) {
              afterSuccessHandlerStake();
              notification.success({
                message: "Success",
                description: successTipStake,
              });
            }
          } catch (error: any) {
            setIsClaimAndStake(false);
          }
        }
      }
    }
  };

  console.log("claimedByContract", claimedByContract, isAgent, isClaimAndStake);

  const clickClaimAndStake = async () => {
    setIsClaimAndStake(true);
    if (claimAmout?.register?.cexName === "MindChain") {
      try {
        setActionLoop(true);
        const res = await mindAirdropRelay();
        if (res) {
          statusRunClaim();
        } else {
          setActionLoop(false);
        }
      } catch (error) {
        setActionLoop(false);
      }
    } else {
      const proof = JSON.parse(claimAmout.proof);
      const res = await claimAsync(claimAmout.amount, proof);
      if (res) {
        afterSuccessHandler();
        notification.success({
          message: "Success",
          description: successTip,
        });
        await stake(formatEther(BigInt(claimAmout?.amount)));
      }
    }
  };

  const afterSuccessHandler = () => {
    refreshIsClaimed();
    fheBalanceRefresh();
  };
  const afterSuccessHandlerStake = () => {
    agentGetTokenIdRefresh();
    fheBalanceRefresh();
    refreshStakeAmount();
    setIsClaimAndStake(false);
    setIsAirdropSuccessModalopen(true);
  };

  //just claim
  useRelayerStatusHandler(
    status,
    statusCancel,
    afterSuccessHandler,
    setActionLoop,
    successTip,
    AirdropContractErrorCode
  );

  //stake and claim:stake
  useRelayerStatusHandler(
    statusStake,
    statusCancelStake,
    afterSuccessHandlerStake,
    setActionLoopStake,
    successTipStake,
    Agent1ContractErrorCode
  );
  //stake and claim:claim
  useRelayerClaimStatus(
    statusClaim,
    statusCancelClaim,
    afterSuccessHandler,
    setActionLoop,
    successTip,
    AirdropContractErrorCode,
    stake,
    claimAmout
  );

  useAsyncEffect(async () => {
    if (claimAmout?.amount) {
      if (
        claimAmout.register?.cexName &&
        claimAmout.register.cexName !== "MindChain"
      ) {
        // setClaimed(true);
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

  const termsChange: CheckboxProps["onChange"] = (e) => {
    console.log(`checked = ${e.target.checked}`);
    setPrivacy(e.target.checked);
  };

  console.log("airdropSuccessModalopen", airdropSuccessModalopen);

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
          className="p-[24px] mt-[50px] rounded-[8px] bg-[url('/images/check-eligibility-bg.png')]
                  bg-center bg-cover opacity-90"
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
          <div className="p-[24px] mt-[20px] rounded-[8px] bg-[url('/images/vhe-claim-bg.png')] bg-center bg-cover">
            <div className="text-[18px] font-[900]">
              {!claimedByContract
                ? "Congratulations! You're Eligible"
                : "Congratulations! You've Claimed"}
            </div>
            <div className="flex justify-between gap-[10px] items-end flex-wrap">
              <div className="flex-1">
                <div className="text-[var(--mind-grey)] text-[12px] mt-[5px]">
                  You can claim the following amount:
                </div>
                <div className="text-[30px] text-[var(--mind-brand)] font-[700] mt-[20px] min-w-[280px] bg-[rgba(255,255,255,0.05)] flex justify-center rounded-[10px] py-[30px] px-[10px]">
                  <div className="text-center">
                    {numberDigitsNoMillify(
                      formatEther(BigInt(claimAmout?.amount))
                    ) + " "}
                    $FHE
                    {claimAmout?.register?.cexName &&
                    claimAmout?.register?.cexName !== "MindChain" ? (
                      <div className="text-[12px] font-[600] text-white px-[20px]">
                        $FHE will be auto-credited to your CEX account. Deposits
                        are processed sequentially and may take up to 2h
                      </div>
                    ) : claimedByContract &&
                      claimAmout?.register?.cexName === "MindChain" ? (
                      <div className="text-white text-[12px] font-[600]">
                        on{" "}
                        <a
                          href={
                            isDev() || isProd()
                              ? mindtestnet.blockExplorers.default.url
                              : mindnet.blockExplorers.default.url
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white hover:text-white inline-block text-[12px] font-[600] underline hover:underline"
                        >
                          MindChain
                        </a>
                      </div>
                    ) : claimedByContract ? (
                      <div className="text-white text-[12px] font-[600]">
                        on{" "}
                        <a
                          href={
                            isDev() || isProd()
                              ? bnbtestnet.blockExplorers.default.url
                              : bnb.blockExplorers.default.url
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white hover:text-white inline-block text-[12px] font-[600] underline hover:underline"
                        >
                          BNB Smart Chain
                        </a>
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </div>
              {claimAmout?.register?.cexName &&
              claimAmout?.register?.cexName !== "MindChain" ? (
                <div className="flex-1 min-w-[200px] md:px-[30px]">
                  <div className="text-center text-[12px] leading-[12px]">
                    You can now launch your Agent with your $FHE to start
                    earning more $FHE
                  </div>
                  <Link
                    href="/agentlaunch"
                    style={{ height: "38px", lineHeight: "38px" }}
                    className="btn-Link-white-font inline-block flex-grow-0 mt-[10px]"
                  >
                    Launch Your Agent
                  </Link>
                  <CEXDrawer claimAmout={claimAmout} />
                </div>
              ) : !claimedByContract || isClaimAndStake ? (
                <div className="flex items-end pb-[10px] flex-1 justify-around gap-[10px]">
                  <div className="w-[145px]">
                    <div className="flex justify-between items-center">
                      <div className="text-[12px] text-center leading-[12px]">
                        {claimAmout?.register?.cexName === "MindChain"
                          ? "Claim $FHE on MindChain"
                          : "Claim $FHE on BNB Smart Chain"}
                      </div>
                      <MindTip
                        placement="bottom"
                        title={
                          claimAmout?.register?.cexName === "MindChain" ? (
                            <div className="text-[12px]">
                              We offer 0 gas option for claiming on MindChain.
                              During periods of high network traffic,
                              transaction may take longer than usual. You can
                              choose to claim instantly by paying gas yourself,{" "}
                              <Link
                                href={bridgeMindgasLink}
                                className="text-[12px] text-[var(--mind-brand)] hover:text-[var(--mind-brand)] underline hover:underline"
                              >
                                Bridge gas (ETH)
                              </Link>
                              <br></br>
                              <MindChainPayGas
                                claimAmout={claimAmout}
                                refreshIsClaimed={refreshIsClaimed}
                                btnDisabled={airdropContractAddressHaveNull}
                              />
                            </div>
                          ) : null
                        }
                        isShow={claimAmout?.register?.cexName === "MindChain"}
                      />
                    </div>

                    <Button
                      type="primary"
                      className="button-brand-border mt-[10px]"
                      onClick={() => clickClaim()}
                      style={{ height: "38px" }}
                      loading={
                        claimLoading ||
                        actionLoop ||
                        agentStakeLoading ||
                        actionLoopStake
                      }
                      disabled={airdropContractAddressHaveNull}
                    >
                      Claim $FHE
                    </Button>
                  </div>
                  <div className="w-[145px]">
                    <div className="text-[12px] text-center leading-[12px]">
                      {isAgent
                        ? "Stake to your Agent to earn more $FHE!"
                        : "Launch Agent instantly to earn more $FHE!"}
                      <br />( Highest APY: 400% )
                    </div>
                    <Button
                      type="primary"
                      className="button-brand-border mt-[10px]"
                      onClick={clickClaimAndStake}
                      style={{ height: "38px" }}
                      loading={
                        agentStakeLoading ||
                        actionLoopStake ||
                        claimLoading ||
                        actionLoop
                      }
                      disabled={airdropContractAddressHaveNull}
                    >
                      Claim & Stake
                    </Button>
                  </div>
                </div>
              ) : agentStakeAmount === "0" || !isAgent ? (
                <div className="flex-1 min-w-[200px] md:px-[30px]">
                  <div>
                    <div className="text-[12px] text-center leading-[12px]">
                      Next,
                    </div>
                    <div className="text-[12px] text-center leading-[12px]">
                      {!agentStakeAmount ? "Launch your" : "Stake to your"}
                      <span className="text-[var(--mind-brand)]">
                        {" "}
                        AI Agent{" "}
                      </span>
                      in AgenticWorld and start earning more $FHE!
                      <br />( Highest APY: 400% )
                    </div>
                  </div>
                  <AirDropStakeModal
                    refreshStakeAmount={refreshStakeAmount}
                    agentStakeAmount={agentStakeAmount}
                  />
                </div>
              ) : airdropSuccessModalopen ? (
                // <AirDropStakeModal
                //   refreshStakeAmount={refreshStakeAmount}
                //   agentStakeAmount={agentStakeAmount}
                // />
                <AirDropStakeSuccessModal
                  agentStakeAmount={agentStakeAmount}
                  refreshStakeAmount={refreshStakeAmount}
                />
              ) : (
                <div className="flex-1 min-w-[200px] md:px-[30px]">
                  <div>
                    <div className="text-[12px] text-center leading-[12px]">
                      Well done!
                    </div>
                    <div className="text-[12px] text-center leading-[12px]">
                      Your Agent is now set up.You&apos;re ready to start
                      training it!
                    </div>
                  </div>
                  <Link
                    href="/agenticworld"
                    style={{ height: "38px", lineHeight: "38px" }}
                    className="btn-Link-white-font inline-block flex-grow-0 mt-[10px]"
                  >
                    Go AgenticWorld
                  </Link>
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
