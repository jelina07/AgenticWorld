import { Button, message, Modal, notification } from "antd";
import React, { useState } from "react";
import MindTip from "../utils/MindTip";
import {
  useAgentGetStakeAmount,
  useAgentGetTokenId,
  useAgentStake,
  useEarlyBirdAirdropCheck,
  useEarlyBirdAirdropClaim,
  useEarlyBirdAirdropIsClaimed,
  useEarlyBirdAirdropRelayerClaim,
  useGetFheBalance,
  useRelayerGetStatus,
  useRelayerStake,
} from "@/sdk";
import {
  checkAmountControlButtonShow,
  firstStakeAmount,
  getMore$FHE,
  judgeUseGasless,
  numberDigitsNoMillify,
} from "@/utils/utils";
import { formatEther } from "viem";
import useAgentGetTokenIdStore from "@/store/useAgentGetTokenId";
import { useAccount } from "wagmi";
import { bnb, bnbtestnet, mindnet, mindtestnet } from "@/sdk/wagimConfig";
import { useAsyncEffect } from "ahooks";
import useRelayerStatusHandler from "@/hooks/useRelayerStatusHandler";
import useRelayerClaimStatus from "@/hooks/useRelayerClaimStatus";
import {
  Agent1ContractErrorCode,
  AirdropContractErrorCode,
} from "@/sdk/utils/script";
import { useLov } from "@/store/useLov";
const successTip = "Claim Success !";
const successTipStake = "Stake Success !";
export default function EarlyBirdAirdrop() {
  const [isClaimAndStake, setIsClaimAndStake] = useState(false);
  const [actionLoop, setActionLoop] = useState(false);
  const [actionLoopStake, setActionLoopStake] = useState(false);
  const { chainId } = useAccount();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { refresh: agentGetTokenIdRefresh } = useAgentGetTokenId();
  const agentTokenId = useAgentGetTokenIdStore((state) => state.agentTokenId);
  const isAgent = agentTokenId !== 0;
  const { data: claimAmout } = useEarlyBirdAirdropCheck();

  const { refresh: fheBalanceRefresh } = useGetFheBalance();
  const { data: agentStakeAmount, refresh: refreshStakeAmount } =
    useAgentGetStakeAmount({
      tokenId: agentTokenId,
    });
  const { runAsync: relayerAgentStake } = useRelayerStake();
  const { runAsync: agentStake, loading: agentStakeLoading } = useAgentStake({
    waitForReceipt: true,
  });

  const {
    data: claimedByContract,
    runAsync: airdropIsClaimed,
    refresh: refreshIsClaimed,
  } = useEarlyBirdAirdropIsClaimed();

  const { runAsync: claimAsync, loading: claimLoading } =
    useEarlyBirdAirdropClaim({
      waitForReceipt: true,
    });
  const { runAsync: mindAirdropRelay } = useEarlyBirdAirdropRelayerClaim();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const {
    data: status,
    run: statusRun,
    cancel: statusCancel,
  } = useRelayerGetStatus("claim", "early-bird");

  const {
    data: statusClaim,
    run: statusRunClaim,
    cancel: statusCancelClaim,
  } = useRelayerGetStatus("claim", "early-bird");

  const {
    data: statusStake,
    run: statusRunStake,
    cancel: statusCancelStake,
  } = useRelayerGetStatus("stake");

  const { getContractAdress } = useLov();
  const airdropContractAddressIsHave = getContractAdress()
    .filter(
      (item) =>
        item.key === "aidrop_early_bird_bsc" ||
        item.key === "aidrop_early_bird_mind"
    )
    .some((item) => item.value);

  const clickClaim = async () => {
    setIsClaimAndStake(false);
    if (claimAmout?.type === "MindChain") {
      try {
        setActionLoop(true);
        const res = await mindAirdropRelay();
        console.log("res", res);

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
  const clickClaimAndStake = async () => {
    setIsClaimAndStake(true);
    if (claimAmout?.type === "MindChain") {
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
      if (claimAmout?.type === "MindChain") {
        await airdropIsClaimed("MindChain");
      } else {
        await airdropIsClaimed("Bsc");
      }
    }
  }, [claimAmout]);

  return (
    <>
      <div className={`${claimAmout ? "" : "hidden"}`}>
        <img
          src="/images/earlyBirdAirdrop.png"
          alt="earlyBirdAirdrop"
          className="cursor-pointer w-[85px] flex-shrink-0"
          onClick={showModal}
        />
        <div className="text-[var(--mind-brand)] text-[10px] flex items-center justify-center gap-[5px]">
          <span>Click me</span>
          <img src="/icons/left-arraw.svg" alt="left-arraw" />
        </div>
      </div>

      <Modal
        title="This is a Thank you letter from Mind Network"
        open={isModalOpen}
        onCancel={handleCancel}
        className="mind-madal"
        footer={null}
      >
        <div>
          <div className="text-[12px] font-[400] leading-[180%]">
            We&apos;ve made it through our first month in AgenticWorld together,
            and honestly, we couldn&apos;t have done it without you.
          </div>
          <div className="text-[12px] font-[400] leading-[180%]">
            As a sincere thank you for being one of our first 10000 supporters,
            CitizenZ_0 has prepared a special gift just for you:
            <span className="inline-flex align-middle">
              <MindTip
                placement="bottom"
                title={
                  <span className="text-[12px]">
                    FHE rewards amount is based on your Agent&apos;s training
                    rewards.
                  </span>
                }
              />
            </span>
          </div>
          <div className="p-[20px] flex justify-between">
            <div className="text-center">
              <img
                src="/icons/birdFHE.svg"
                alt="birdFHE"
                className="inline-block w-[50px]"
              />
              <br />
              <span className="text-[18px] font-[700 mt-[10px] text-[var(--mind-brand)]">
                {claimAmout?.amount &&
                  numberDigitsNoMillify(
                    formatEther(BigInt(claimAmout.amount))
                  ) + " "}
                FHE
              </span>
            </div>
            <img
              src="/icons/earlybirdAngel.svg"
              alt="earlybirdAngel"
              className="w-[220px]"
            />
          </div>
          {claimedByContract && !isClaimAndStake ? (
            <Button
              type="primary"
              className="button-brand-border-white-font"
              disabled={true}
            >
              Claimed !
            </Button>
          ) : (
            <div className="flex mt-[40px] gap-[20px]">
              <Button
                type="primary"
                className="button-brand-border-white-font"
                onClick={clickClaim}
                loading={
                  claimLoading ||
                  actionLoop ||
                  agentStakeLoading ||
                  actionLoopStake
                }
                disabled={!airdropContractAddressIsHave}
              >
                Claim
              </Button>
              <Button
                type="primary"
                className="button-brand-border-white-font"
                onClick={clickClaimAndStake}
                loading={
                  agentStakeLoading ||
                  actionLoopStake ||
                  claimLoading ||
                  actionLoop
                }
                disabled={!airdropContractAddressIsHave}
              >
                Claim & Stake
              </Button>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
