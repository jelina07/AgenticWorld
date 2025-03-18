"use client";
import { Col, Row } from "antd";
import React, { useMemo, useRef } from "react";
import Link from "next/link";
import Arraw from "@/public/icons/arraw.svg";
import Lock from "@/components/utils/Lock";
import StartConfirmModal from "./detials/StartConfirmModal";
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useHubGetCurrent, useHubGetCurrentExp } from "@/sdk";
import useAgentGetTokenIdStore from "@/store/useAgentGetTokenId";

export default function HubList({
  subnetInfor,
  isBasic,
  loading,
  isLaunch = false,
}: {
  subnetInfor: SubnetInfoType[];
  isBasic: boolean;
  loading: boolean;
  isLaunch?: boolean;
}) {
  const startModalRef: any = useRef(null);
  const { openConnectModal } = useConnectModal();
  const { isConnected, address } = useAccount();
  const agentTokenId = useAgentGetTokenIdStore((state) => state.agentTokenId);
  const {
    data: learningId,
    refresh: refreshLearningId,
    loading: learningIdLoading,
  } = useHubGetCurrent({
    tokenId: agentTokenId,
  });
  const { data: currentExp, loading: currentExpLoading } = useHubGetCurrentExp({
    tokenId: agentTokenId,
    hubId: learningId,
  });

  const lockTimeReach =
    subnetInfor &&
    learningId &&
    currentExp !== undefined &&
    currentExp ===
      subnetInfor.find((item: SubnetInfoType) => item.subnetId === learningId)
        ?.lockup;

  console.log("current", agentTokenId, learningId, currentExp, lockTimeReach);

  const showModal = (event: any, hubItem: SubnetInfoType) => {
    event.preventDefault();
    if (isConnected) {
      startModalRef.current?.cliskSetCurrentHub(hubItem);
      startModalRef.current?.clickStartConfirmModal();
    } else {
      openConnectModal?.();
    }
  };
  return (
    <div>
      {loading ? (
        <div className="text-center mt-[10px] text-white">loading...</div>
      ) : subnetInfor?.length === 0 ? (
        <div className="text-center text-white">Coming soon...</div>
      ) : (
        <Row className="mt-[20px]" gutter={[16, { xs: 16, sm: 16, md: 24 }]}>
          {subnetInfor?.map((item: any) => (
            <Col
              key={item.subnetId}
              xs={{ span: 24 }}
              md={{ span: 12 }}
              lg={{ span: 8 }}
            >
              <Link href={`/agenticworld/${item.subnetId}`}>
                <div
                  className={`hub-box p-[40px] h-full ${
                    isBasic
                      ? "bg-[url('/icons/subnet-box1.svg')]"
                      : "bg-[url('/icons/subnet-box2.svg')]"
                  } bg-no-repeat bg-right-bottom bg-cover ${
                    isLaunch &&
                    learningId &&
                    item.subnetId !== learningId &&
                    currentExp !== undefined &&
                    !lockTimeReach
                      ? "opacity-[0.5]"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-[5px] justify-between">
                    <div className="flex items-center gap-[5px]">
                      <span
                        className={`inline-block w-[16px] h-[16px] rounded-[50%] ${
                          isBasic ? "blue-gradient" : "yellow-gradient"
                        }`}
                      ></span>
                      <span className="text-[18px] text-white font-[800] leading-[1.2]">
                        {item.subnetName}
                      </span>
                    </div>

                    <div
                      className={`text-white ${
                        learningId &&
                        item.subnetId === learningId &&
                        currentExp !== undefined &&
                        !lockTimeReach
                          ? ""
                          : "hidden"
                      }`}
                    >
                      <Lock />
                    </div>
                  </div>
                  {isBasic && !isLaunch ? (
                    <div className="text-[var(--mind-brand)] text-[18px] mt-[20px]">
                      {item.subnetLevel}
                    </div>
                  ) : (
                    <div className="text-[14px] text-[#C7C7C7] mt-[20px] h-[100px]">
                      {item.subnetInfo}
                    </div>
                  )}

                  <div className="mt-[30px] text-white text-[14px]">
                    <div className="flex justify-between gap-[3px]">
                      <span>Payout Ratio:</span>
                      <span>{item.payoutRatio}</span>
                    </div>
                    <div className="flex justify-between gap-[3px]">
                      <span>Enrolled Agents:</span>
                      <span>{item.agent}</span>
                    </div>
                    <div className="flex justify-between gap-[3px]">
                      <span>Learning Lock-up:</span>
                      <span>{item.lockup}</span>
                    </div>
                    <div
                      className={`flex justify-between gap-[3px] items-start ${
                        item.subnetRequire ? "" : "hidden"
                      }`}
                    >
                      <span>Require:</span>
                      <div className="text-right">
                        {item.subnetRequire
                          ?.split(",")
                          .map((obj: any, index: number) => (
                            <div
                              className="text-[var(--mind-brand)]"
                              key={index}
                            >
                              [{obj}]
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                  {learningId && item.subnetId === learningId ? (
                    <div className="flex items-center mt-[30px] justify-end">
                      <span className="text-[var(--mind-brand)]">Learning</span>
                      <img src="/icons/cz.svg" alt="cz" width={25} />
                    </div>
                  ) : (learningId !== undefined && learningId === 0) ||
                    lockTimeReach ||
                    !address ? (
                    <div className="text-white hover:text-[var(--mind-brand)] text-[14px] font-[600] flex items-center mt-[30px] justify-end">
                      <span onClick={(event) => showModal(event, item)}>
                        Start
                      </span>
                    </div>
                  ) : (
                    <div className="text-[var(--mind-grey)] text-[14px] font-[600] flex items-center mt-[30px] justify-end">
                      <span>Start</span>
                    </div>
                  )}
                </div>
              </Link>
            </Col>
          ))}
        </Row>
      )}
      <StartConfirmModal
        ref={startModalRef}
        learningId={learningId}
        refreshLearningId={refreshLearningId}
      />
    </div>
  );
}
