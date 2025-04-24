"use client";
import HubInfo from "@/components/agenticworld/detials/HubInfo";
import StartConfirmModal from "@/components/agenticworld/detials/StartConfirmModal";
import UseCase from "@/components/agenticworld/detials/UseCase";
import useAgentGetTokenIdStore from "@/store/useAgentGetTokenId";
import {
  useHubAgentCount,
  useHubGetApy,
  useHubGetCurrent,
  useHubGetCurrentExp,
  useHubGetStakeAmount,
  useHubList,
} from "@/sdk";
import useGetLearningHubId from "@/store/useGetLearningHubId";
import { Button } from "antd";
import React, { useEffect, useMemo, useRef } from "react";
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CommingSoon from "@/components/utils/CommingSoon";
import DeepSeekHub from "@/components/deepseekHub";

export default function page({ params }: { params: any }) {
  const startModalRef: any = useRef(null);
  const router = useRouter();
  const { openConnectModal } = useConnectModal();
  const { address, isConnected } = useAccount();
  const { data: subnetList } = useHubList({
    cacheKey: "useSubnetList",
    staleTime: 5 * 60 * 1000,
  });
  const { data: hubAgentCount, refresh: refreshHubAgentCount } =
    useHubAgentCount({ hubIds: subnetList });
  const { data: hubApy } = useHubGetApy({ hubIds: subnetList });
  const { data: hubStake } = useHubGetStakeAmount({ hubIds: subnetList });
  const agentTokenId = useAgentGetTokenIdStore((state) => state.agentTokenId);
  const { refresh: refreshLearningId } = useHubGetCurrent({
    tokenId: agentTokenId,
  });
  const learningId = useGetLearningHubId((state) => state.learningHubId);
  const hubIds = useMemo(() => {
    return learningId !== undefined ? [learningId] : [];
  }, [learningId]);
  const { learnSecond } = useHubGetCurrentExp({
    tokenId: agentTokenId,
    hubIds: hubIds,
  });

  const lockTimeReach =
    subnetList &&
    learningId &&
    learnSecond !== undefined &&
    learnSecond[0] >
      Number(subnetList.find((item: any) => item.id === learningId)?.lockUp);

  const currentSubnet = subnetList
    ?.filter((item: any) => item.id === Number(params.subnetId))
    ?.map((obj: any) => ({
      subnetId: obj.id,
      type: obj.type,
      subnetName: obj.name,
      subnetInfo: obj.desc,
      lockup: obj.lockUp,
      subnetLevel: obj.Note,
      subnetRequire: obj.requireName,
      needSign: obj.needSign,
      isAccess: obj.isAccess,
      usecase: obj.usecase,
      canLinkDetial: obj.canLinkDetail,
      moreInfo: obj.moreInfo,
      frameworkUrl: obj.frameworkUrl,
    }))[0];
  const currentSubnetIndex = subnetList?.findIndex((item: any) => {
    return item.id === Number(params.subnetId);
  });

  const showModal = () => {
    if (isConnected) {
      startModalRef.current?.cliskSetCurrentHub(currentSubnet);
      startModalRef.current?.clickStartConfirmModal();
    } else {
      openConnectModal?.();
    }
  };

  const goback = () => {
    router.back();
  };
  console.log("currentSubnet?.subnetId", currentSubnet?.subnetId);

  return (
    <div className="px-[var(--layout-sm)] md:px-[var(--layout-md)] lg:px-[var(--layout-lg)] xl:px-[var(--layout-xl)] 2xl:px-[var(--layout-2xl)] overflow-hidden pb-[100px]">
      <div className="mt-[40px] px-[20px]">
        <div
          className={`text-[26px] font-[900] flex items-center ${
            currentSubnet?.subnetName ? "" : "hidden"
          }'`}
        >
          <span
            className="text-white hover:text-white cursor-pointer mr-[10px] font-[500]"
            onClick={goback}
          >
            &lt;
          </span>
          <span>
            {currentSubnet?.subnetName ? " " + currentSubnet?.subnetName : ""}
          </span>
          <div
            className={`flex items-center ml-[20px] ${
              currentSubnet?.isAccess ? "hidden" : ""
            }`}
          >
            <CommingSoon />
          </div>
        </div>
        <div className="mt-[20px] text-[12px] leading-3">
          {currentSubnet?.subnetInfo}
        </div>
        <div className="mt-[80px]">
          <HubInfo
            lockUp={currentSubnet?.lockup}
            agentCount={hubAgentCount?.[currentSubnetIndex]}
            hubStakeAmount={hubStake?.[currentSubnetIndex]}
            hubApy={hubApy?.[currentSubnetIndex]}
          />
        </div>
        <div className="mt-[50px] flex gap-[20px]">
          <div>
            {currentSubnet?.isAccess ? (
              <Button
                type="primary"
                className="button-brand-border-white-font"
                disabled={
                  learningId === Number(params.subnetId) ||
                  (!(
                    agentTokenId !== undefined &&
                    agentTokenId !== 0 &&
                    learningId === 0
                  ) &&
                    !lockTimeReach)
                }
                onClick={() => showModal()}
              >
                {learningId === Number(params.subnetId)
                  ? "Training..."
                  : "Start Training"}
              </Button>
            ) : (
              <Button
                type="primary"
                className="button-brand-border-white-font"
                disabled={true}
                onClick={() => showModal()}
              >
                Start Training
              </Button>
            )}
          </div>
          <Link
            href="/agenticworld"
            className="btn-Link-white-font inline-block flex-grow-0"
          >
            Explore New Skills
          </Link>
        </div>
        {currentSubnet?.canLinkDetial ? (
          <UseCase currentSubnet={currentSubnet} />
        ) : (
          <></>
        )}
      </div>
      <StartConfirmModal
        ref={startModalRef}
        learningId={learningId}
        refreshLearningId={refreshLearningId}
        subnetList={subnetList}
        refreshHubAgentCount={refreshHubAgentCount}
      />
    </div>
  );
}
