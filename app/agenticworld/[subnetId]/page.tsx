"use client";
import HubInfo from "@/components/agenticworld/detials/HubInfo";
import StartConfirmModal from "@/components/agenticworld/detials/StartConfirmModal";
import UseCase from "@/components/agenticworld/detials/UseCase";
import useAgentGetTokenIdStore from "@/store/useAgentGetTokenId";
import {
  useHubAgentCount,
  useHubGetCurrent,
  useHubGetCurrentExp,
  useHubGetStakeAmount,
  useHubList,
} from "@/sdk";
import useGetLearningHubId from "@/store/useGetLearningHubId";
import { Button } from "antd";
import React, { useRef } from "react";

export default function page({ params }: { params: any }) {
  const startModalRef: any = useRef(null);
  const { data: subnetList } = useHubList({
    cacheKey: "useSubnetList",
    staleTime: 5 * 60 * 1000,
  });
  const { data: hubAgentCount } = useHubAgentCount({ hubIds: subnetList });
  const { data: hubStake } = useHubGetStakeAmount({ hubIds: subnetList });
  const agentTokenId = useAgentGetTokenIdStore((state) => state.agentTokenId);
  const { refresh: refreshLearningId } = useHubGetCurrent({
    tokenId: agentTokenId,
  });
  const learningId = useGetLearningHubId((state) => state.learningHubId);
  const { data: currentExp } = useHubGetCurrentExp({
    tokenId: agentTokenId,
    hubId: learningId,
  });

  const lockTimeReach =
    subnetList &&
    learningId &&
    currentExp !== undefined &&
    currentExp ===
      subnetList.find((item: SubnetInfoType) => item.subnetId === learningId)
        ?.lockup;

  const currentSubnet = subnetList?.find(
    (item: any) => item.id === Number(params.subnetId)
  );
  const currentSubnetIndex = subnetList?.findIndex((item: any) => {
    return item.id === Number(params.subnetId);
  });
  console.log(
    "hubAgentCount",
    hubAgentCount,
    currentSubnetIndex,
    hubAgentCount?.[currentSubnetIndex],
    hubStake
  );

  const showModal = () => {
    startModalRef.current?.clickStartConfirmModal();
  };

  return (
    <div className="px-[var(--layout-sm)] md:px-[var(--layout-md)] lg:px-[var(--layout-lg)] overflow-hidden pb-[100px]">
      <div className="mt-[40px] px-[20px]">
        <div className="text-[26px] font-[900]">{currentSubnet?.name}</div>
        <div className="mt-[20px] text-[12px] leading-3">
          {currentSubnet?.desc}
        </div>
        <div className="mt-[80px]">
          <HubInfo
            lockUp={currentSubnet?.lockUp}
            agentCount={hubAgentCount?.[currentSubnetIndex]}
            hubStakeAmount={hubStake?.[currentSubnetIndex]}
          />
        </div>
        <div className="mt-[50px] w-[170px]">
          <Button
            type="primary"
            className="button-brand-border-white-font"
            disabled={learningId === Number(params.subnetId) || !lockTimeReach}
            onClick={showModal}
          >
            {learningId === Number(params.subnetId) ? "Learning..." : "Start"}
          </Button>
        </div>
        <div className="mt-[50px]">
          <UseCase />
        </div>
      </div>
      <StartConfirmModal
        ref={startModalRef}
        refreshLearningId={refreshLearningId}
        learningId={learningId}
      />
    </div>
  );
}
