import HubInfo from "@/components/agenticworld/detials/HubInfo";
import UseCase from "@/components/agenticworld/detials/UseCase";
import { Button } from "antd";
import React from "react";

export default function page({ params }: { params: any }) {
  const learningId = 1;
  const lockTimeReach = false;
  return (
    <div className="px-[var(--layout-sm)] sm:px-[var(--layout-md)] overflow-hidden pb-[100px]">
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
            // disabled={learningId === Number(params.subnetId) || !lockTimeReach}
          >
            {learningId === Number(params.subnetId) ? "Learning..." : "Start"}
          </Button>
        </div>
        <div className="mt-[50px]">
          <UseCase />
        </div>
      </div>
    </div>
  );
}
