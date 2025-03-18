"use client";
import { Button, Input, message } from "antd";
import Lock from "@/components/utils/Lock";
import UnLock from "@/components/utils/UnLock";
import Edit from "@/public/icons/edit.svg";
import Link from "next/link";
import LaunchAgent from "./LaunchAgent";
import { useState } from "react";
import StakeModal from "./StakeModal";
import DecreseModal from "./DecreseModal";
import useAgentGetTokenIdStore from "@/store/useAgentGetTokenId";
import ShutDownAgent from "./ShutDownAgent";
import {
  useAgentGetStakeAmount,
  useClaimReward,
  useGetClaimableReward,
} from "@/sdk";
import { numberDigits } from "@/utils/utils";

export default function MyAgent() {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState("CitizenZ_0");

  const editName = () => {
    setIsEditing(true);
  };

  const handleInputBlur = (event: any) => {
    setText(event.target.value);
    setIsEditing(false);
  };
  const agentTokenId = useAgentGetTokenIdStore((state) => state.agentTokenId);
  const isAgent = agentTokenId !== 0;
  const {
    data: agentStakeAmount,
    loading,
    refresh: refreshStakeAmount,
  } = useAgentGetStakeAmount({
    tokenId: agentTokenId,
  });
  console.log("agentStakeAmount", agentStakeAmount);
  const {
    data: claimableReward,
    loading: claimableRewardLoading,
    refresh: claimableRewardRefresh,
  } = useGetClaimableReward();
  console.log("claimableReward", claimableReward);
  console.log("claimableRewardLoading", loading, claimableRewardLoading);
  const { runAsync: claim, loading: claimLoading } = useClaimReward({
    waitForReceipt: true,
  });

  const clickClaim = async () => {
    if (claimableReward && claimableReward !== "0") {
      const res = await claim();
      if (res) {
        claimableRewardRefresh();
      }
    } else {
      message.open({
        type: "warning",
        content: "You have no reward!",
        duration: 5,
      });
    }
  };

  return (
    <>
      <div
        className="p-[15px] sm:p-[35px] bg-[url('/images/my-agent-bg.png')] bg-center bg-cover mt-[40px] sm:mt-[80px] 
                    lg:flex items-center justify-between gap-[20px]"
      >
        <div className="bg-[url('/icons/portrait.svg')] w-[180px] h-[180px] bg-contain bg-no-repeat mb-[50px] lg:mb-[0px] ">
          <img
            src="/icons/cz.svg"
            alt="cz"
            width="150"
            className="mx-auto pt-[30px]"
          />
          <div className={`${!isAgent ? "hidden" : ""}`}>
            <Button
              type="primary"
              className={`button-white-border-white-font mt-[10px]`}
            >
              Update
            </Button>
          </div>
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
                          autoFocus
                          maxLength={30}
                          style={{
                            fontSize: "14px",
                            padding: "5px",
                            color: "black",
                          }}
                        />
                      ) : (
                        <span className="text-[14px]">{text}</span>
                      )}
                      <div className="cursor-pointer" onClick={editName}>
                        <Edit />
                      </div>
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
                    <span className="text-[30px] text-light-shadow">2</span>
                  </div>
                </div>
              </div>
              <div className="mt-[15px] flex gap-[14px] flex-col md:flex-row">
                <div className="rounded-[8px] flex-1 border-[length:var(--border-width)] border-[var(--btn-border)] p-[11px]">
                  <div className="text-[14px] text-[var(--mind-grey)] my-auto">
                    State
                  </div>
                  <div className="flex gap-[10px] mt-[20px] h-[45px] items-center">
                    <Lock />
                    <UnLock />
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
                      {loading
                        ? "loading..."
                        : agentStakeAmount && numberDigits(agentStakeAmount)}
                    </span>
                    <span className="text-[12px] text-[var(--mind-brand)]">
                      {" "}
                      FHE
                    </span>
                  </div>
                  <div className="mt-[40px] flex justify-between gap-[7px] mind-madal">
                    <StakeModal refreshStakeAmount={refreshStakeAmount} />
                    <DecreseModal
                      refreshStakeAmount={refreshStakeAmount}
                      agentStakeAmount={agentStakeAmount}
                    />
                  </div>
                </div>
                <div className="rounded-[8px] flex-1 border-[length:var(--border-width)] border-[var(--btn-border)] p-[11px]">
                  <div className="text-[14px] text-[var(--mind-grey)] whitespace-nowrap">
                    Total Rewards
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
      {isAgent && <ShutDownAgent agentStakeAmount={agentStakeAmount} />}
    </>
  );
}
