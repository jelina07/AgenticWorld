"use client";
import HubInfo from "@/components/agenticworld/detials/HubInfo";
import StartConfirmModal from "@/components/agenticworld/detials/StartConfirmModal";
import UseCase from "@/components/agenticworld/detials/UseCase";
import { useHubAgentCount, useHubList } from "@/sdk";
import { Button } from "antd";
import React, { useRef } from "react";

export default function page({ params }: { params: any }) {
  const startModalRef: any = useRef(null);
  const { data: subnetList, loading } = useHubList({
    cacheKey: "useSubnetList",
    staleTime: 5 * 60 * 1000,
  });
  const { data: hubAgentCount } = useHubAgentCount({ hubIds: subnetList });
  const learningId = 1;
  const lockTimeReach = true;
  const showModal = () => {
    startModalRef.current?.clickStartConfirmModal();
  };

  return (
    <div className="px-[var(--layout-sm)] md:px-[var(--layout-md)] lg:px-[var(--layout-lg)] overflow-hidden pb-[100px]">
      <div className="mt-[40px] px-[20px]">
        <div className="text-[26px] font-[900]">FCN - FHE Consensus</div>
        <div className="mt-[20px] text-[12px] leading-3">
          Data consensus agent It is an agent leverage FHE technology during the
          data consensu process.....
        </div>
        <div className="mt-[80px]">
          <HubInfo />
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
      <StartConfirmModal ref={startModalRef} learningId={learningId} />
    </div>
  );
}
