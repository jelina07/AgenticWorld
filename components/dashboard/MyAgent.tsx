"use client";
import { Button, Input, message, notification } from "antd";
import Lock from "@/components/utils/Lock";
import UnLock from "@/components/utils/UnLock";
import Edit from "@/public/icons/edit.svg";
import Link from "next/link";
import LaunchAgent from "./LaunchAgent";
import { useEffect, useMemo, useState } from "react";
import StakeModal from "./StakeModal";
import DecreseModal from "./DecreseModal";
import useAgentGetTokenIdStore from "@/store/useAgentGetTokenId";
import ShutDownAgent from "./ShutDownAgent";
import {
  useAgentGetMeta,
  useAgentGetStakeAmount,
  useAgentPutMeta,
  useClaimReward,
  useGetClaimableReward,
  useGetFheBalance,
  useHubGetCurrent,
  useHubGetCurrentExp,
} from "@/sdk";
import { number5Digits, numberDigits } from "@/utils/utils";
import useGetLearningHubId from "@/store/useGetLearningHubId";
import { CheckOutlined } from "@ant-design/icons";
import Created from "../utils/created";
import { useAccount, useChainId } from "wagmi";

export default function MyAgent({
  ids,
  hubList,
}: {
  ids: any[];
  hubList?: any[];
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState("CitizenZ");
  const { chainId } = useAccount();

  const editName = () => {
    setIsEditing(true);
  };

  const confirmEditName = async () => {
    setIsEditing(false);
    const res = await putAgetMeta({
      agentId: agentTokenId,
      agentName: text,
      avatar: "/icons/cz.svg",
    });
    if (res) {
      notification.success({
        message: "Success",
        description: "Name have been updated !",
      });
    }
  };

  const agentTokenId = useAgentGetTokenIdStore((state) => state.agentTokenId);
  const isAgent = agentTokenId !== 0;
  const {
    data: agentStakeAmount,
    loading: agentStakeAmountLoading,
    refresh: refreshStakeAmount,
  } = useAgentGetStakeAmount({
    tokenId: agentTokenId,
  });
  const {
    data: claimableReward,
    loading: claimableRewardLoading,
    refresh: claimableRewardRefresh,
  } = useGetClaimableReward();
  const { runAsync: claim, loading: claimLoading } = useClaimReward({
    waitForReceipt: true,
  });
  const { data } = useHubGetCurrent({
    tokenId: agentTokenId,
  });
  const learningId = useGetLearningHubId((state) => state.learningHubId);
  const { learnSecond } = useHubGetCurrentExp({
    tokenId: agentTokenId,
    hubIds: ids,
    learningId,
  });
  // use learnSecond
  const currentLearnedHub = useMemo(() => {
    return learnSecond?.filter((second: number) => second > 0).length;
  }, [learnSecond]);

  console.log("claimableReward", claimableReward);

  // type 0: no learned; type 1: locked ; type 2:unlocked
  const stateType = useMemo(() => {
    if (currentLearnedHub !== undefined) {
      if (!learningId) {
        return 0;
      } else {
        const currentlearningIdIndex = hubList!.findIndex(
          (item) => item.id === learningId
        );
        const lockTimeReach =
          hubList![currentlearningIdIndex].lockUp <=
          learnSecond![currentlearningIdIndex];

        if (lockTimeReach) {
          return 2;
        } else {
          return 1;
        }
      }
    }
  }, [currentLearnedHub, hubList, learningId, learnSecond]);

  const { refresh: refreshBalance } = useGetFheBalance();

  const { data: agentMeta, loading: agentMetaLoading } = useAgentGetMeta({
    agentId: agentTokenId,
    chainId,
  });
  const { runAsync: putAgetMeta } = useAgentPutMeta();
  useEffect(() => {
    if (agentMeta) {
      setText(agentMeta.agentName);
    }
  }, [agentMeta]);
  console.log("agentMeta", agentMeta);
  const clickClaim = async () => {
    if (claimableReward && claimableReward !== "0") {
      const res = await claim();
      if (res) {
        claimableRewardRefresh();
        refreshBalance();
        notification.success({
          message: "Success",
          description: "Redeem Success !",
        });
      }
    } else {
      message.open({
        type: "warning",
        content: "You have no rewards to redeem !",
        duration: 5,
      });
    }
  };

  const handleInputBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const relatedTarget = event.relatedTarget as HTMLElement | null;
    const isConfirmButton = relatedTarget?.id === "confirmEdit";
    if (!isConfirmButton) {
      if (agentMeta) {
        setText(agentMeta.agentName);
      } else {
        setText("CitizenZ");
      }
      setIsEditing(false);
      message.warning("Canceled!");
    }
  };
  console.log("agentTokenIdagentTokenId", agentTokenId);

  return (
    <>
      <div
        className="p-[15px] sm:p-[35px] bg-[url('/images/my-agent-bg.png')] bg-center bg-cover mt-[40px] sm:mt-[80px] 
                    min-[1140px]:flex items-center justify-between gap-[20px]"
      >
        <div className="bg-[url('/icons/portrait.svg')] w-[180px] h-[180px] bg-contain bg-no-repeat mb-[50px] min-[1140px]:mb-[0px]">
          <img
            src={`${
              !isAgent
                ? "/icons/citizenz_grey.svg"
                : agentMeta
                ? agentMeta.avatar
                : "/icons/cz.svg"
            }`}
            alt="cz"
            width="140"
            className="mx-auto pt-[30px]"
          />
          {/* <div className={`${!isAgent ? "hidden" : ""}`}>
            <Button
              type="primary"
              className={`button-white-border-white-font mt-[10px]`}
            >
              Update
            </Button>
          </div> */}
        </div>
        <div className={`mind-input flex-1`}>
          {isAgent ? (
            <div>
              <div className="font-[800]">My Agent</div>
              <div className="min-[420px]:flex justify-between gap-[14px] flex-wrap">
                <div
                  className="px-[11px] py-[4px] mt-[15px] h-[70px] flex-1 flex items-center
                          bg-[#181818] rounded-[10px] border-[length:var(--border-width)] border-[var(--btn-border)]"
                >
                  <div className="flex-1 flex justify-between items-center gap-[5px] flex-wrap">
                    <span className="text-[var(--mind-grey)] text-[14px]">
                      Name
                    </span>
                    <div className="flex items-center gap-[5px] flex-1 justify-end">
                      {isEditing ? (
                        <input
                          type="text"
                          defaultValue={text}
                          onBlur={handleInputBlur}
                          onChange={(e) => setText(e.target.value)}
                          autoFocus
                          maxLength={30}
                          style={{
                            fontSize: "14px",
                            padding: "5px",
                            color: "black",
                          }}
                        />
                      ) : (
                        <span className="text-[14px]">
                          {agentMetaLoading ? "loading..." : text}
                        </span>
                      )}
                      {isEditing ? (
                        <button
                          onClick={confirmEditName}
                          id="confirmEdit"
                          type="button"
                        >
                          <CheckOutlined style={{ color: "#00ffb1" }} />
                        </button>
                      ) : (
                        <Edit onClick={editName} />
                      )}
                    </div>
                  </div>
                </div>
                <div
                  className=" px-[11px] py-[4px] mt-[15px] h-[70px] flex-1 flex items-center
                            bg-[#181818] rounded-[10px] border-[length:var(--border-width)] border-[var(--btn-border)]"
                >
                  <div className="flex-1 flex justify-between items-center gap-[5px]">
                    <span className="text-[var(--mind-grey)] text-[14px]">
                      Hub Learned
                    </span>
                    <span className="text-[30px] text-light-shadow">
                      {currentLearnedHub !== undefined
                        ? currentLearnedHub
                        : "loading..."}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-[15px] flex gap-[14px] flex-col min-[1140px]:flex-row">
                <div className="rounded-[8px] flex-1 border-[length:var(--border-width)] border-[var(--btn-border)] p-[11px]">
                  <div className="text-[14px] text-[var(--mind-grey)] my-auto">
                    State
                  </div>
                  <div className="flex gap-[10px] mt-[20px] h-[45px] items-center">
                    {currentLearnedHub === undefined ? (
                      "loading..."
                    ) : stateType === 0 ? (
                      <Created />
                    ) : stateType === 1 ? (
                      <Lock />
                    ) : (
                      <UnLock />
                    )}
                  </div>
                  <div className="mt-[40px]">
                    <Link href="/agenticworld" className="btn-Link-white-font">
                      Explore New Skills
                    </Link>
                  </div>
                </div>
                <div className="rounded-[8px] flex-1 border-[length:var(--border-width)] border-[var(--btn-border)] p-[11px]">
                  <div className="text-[14px] text-[var(--mind-grey)] whitespace-nowrap">
                    Stake
                  </div>
                  <div className="mt-[20px] align-bottom h-[45px]">
                    <span className="text-[30px] text-light-shadow">
                      {agentStakeAmountLoading
                        ? "loading..."
                        : agentStakeAmount && numberDigits(agentStakeAmount)}
                    </span>
                    <span className="text-[12px] text-[var(--mind-brand)]">
                      {" "}
                      FHE
                    </span>
                  </div>
                  <div className="mt-[40px] flex justify-between gap-[7px] mind-madal">
                    <StakeModal
                      refreshStakeAmount={refreshStakeAmount}
                      agentStakeAmount={agentStakeAmount}
                      hubList={hubList}
                      learningId={learningId}
                    />
                    <DecreseModal
                      refreshStakeAmount={refreshStakeAmount}
                      agentStakeAmount={agentStakeAmount}
                    />
                  </div>
                </div>
                <div className="rounded-[8px] flex-1 border-[length:var(--border-width)] border-[var(--btn-border)] p-[11px]">
                  <div className="text-[14px] text-[var(--mind-grey)] whitespace-nowrap flex justify-between items-center gap-[2px]">
                    <span>Total Rewards</span>
                    <img
                      src="/icons/refresh.svg"
                      alt="refresh"
                      onClick={claimableRewardRefresh}
                      className={`cursor-pointer ${
                        claimableRewardLoading ? "refresh" : ""
                      }`}
                    />
                  </div>
                  <div className="mt-[20px] align-bottom h-[45px]">
                    <span className="text-[30px] text-light-shadow">
                      {claimableRewardLoading
                        ? "loading..."
                        : claimableReward && numberDigits(claimableReward)}
                    </span>
                    <span className="text-[12px] text-[var(--mind-brand)]">
                      {" "}
                      FHE
                    </span>
                  </div>
                  <div className="mt-[40px]">
                    <Button
                      type="primary"
                      className="button-brand-border-white-font"
                      onClick={clickClaim}
                      loading={claimLoading}
                      disabled={
                        !claimableReward ||
                        numberDigits(claimableReward) === "0"
                      }
                    >
                      Redeem
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <LaunchAgent />
          )}
        </div>
      </div>
      {isAgent && (
        <ShutDownAgent
          refreshStakeAmount={refreshStakeAmount}
          agentStakeAmount={agentStakeAmount}
        />
      )}
    </>
  );
}
