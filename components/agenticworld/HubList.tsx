"use client";
import { Col, Row } from "antd";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import Link from "next/link";
import Lock from "@/components/utils/Lock";
import StartConfirmModal from "./detials/StartConfirmModal";
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import {
  useHubAgentCount,
  useHubGetApy,
  useHubGetCurrent,
  useHubGetCurrentExp,
  useHubList,
} from "@/sdk";
import useAgentGetTokenIdStore from "@/store/useAgentGetTokenId";
import useGetLearningHubId from "@/store/useGetLearningHubId";
import { secondsToHours } from "@/utils/utils";
import CommingSoon from "../utils/CommingSoon";

const HubList = forwardRef(
  (
    {
      filter,
      onSendLoading,
      isLaunch = false,
    }: {
      filter: number;
      onSendLoading?: Function;
      isLaunch?: boolean;
    },
    ref
  ) => {
    const startModalRef: any = useRef(null);
    useImperativeHandle(ref, () => ({
      refreshLearningTime: () => {
        refreshLearningTime();
        refresh();
        onSendLoading && onSendLoading(learningTimeLoading);
      },
    }));
    const { openConnectModal } = useConnectModal();
    const { isConnected, address, chainId } = useAccount();
    const agentTokenId = useAgentGetTokenIdStore((state) => state.agentTokenId);
    const { data, refresh: refreshLearningId } = useHubGetCurrent({
      tokenId: agentTokenId,
    });
    const learningId = useGetLearningHubId((state) => state.learningHubId);
    const hubIds = useMemo(() => {
      return learningId !== undefined ? [learningId] : [];
    }, [learningId]);
    const {
      learnSecond,
      refresh: refreshLearningTime,
      loading: learningTimeLoading,
    } = useHubGetCurrentExp({
      tokenId: agentTokenId,
      hubIds: hubIds,
    });
    console.log("learnSecondlearnSecond", learnSecond);
    const {
      data: subnetList,
      loading,
      refresh,
    } = useHubList({ cacheKey: "useSubnetList", staleTime: 5 * 60 * 1000 });

    const {
      data: hubAgentCount,
      refresh: refreshHubAgentCount,
      loading: hubAgentCountLoading,
    } = useHubAgentCount({ hubIds: subnetList });
    const { data: hubApy, loading: hubApyLoading } = useHubGetApy({
      hubIds: subnetList,
    });

    const subnetInforAll = subnetList?.map((item: any, index: number) => {
      return {
        subnetId: item.id,
        type: item.type,
        subnetName: item.name,
        subnetInfo: item.desc,
        agent:
          !isConnected || hubAgentCount === undefined
            ? "/"
            : hubAgentCountLoading
            ? "loading..."
            : hubAgentCount[index],
        payoutRatio:
          !isConnected || hubAgentCount === undefined
            ? "/"
            : hubApyLoading
            ? "loading..."
            : hubApy[index],
        lockup: item.lockUp,
        subnetLevel: item.note,
        subnetRequire: item.requireName,
        needSign: item.needSign,
        isAccess: item.isAccess,
        canLinkDetial: item.canLinkDetail,
        moreInfo: item.moreInfo,
        frameworkUrl: item.frameworkUrl,
        logo: item.logo,
      };
    }) as SubnetInfoType[];

    console.log("hubApyhubApy", hubApy);

    const linkToDetial = (event: any, canDetial: boolean) => {
      !canDetial ? event.preventDefault() : "";
    };
    const subnetInfor =
      filter === 1
        ? subnetInforAll?.filter((item) => item.subnetLevel === "Required")
        : filter === 2
        ? subnetInforAll?.filter((item) => item.type === 0)
        : filter === 3
        ? subnetInforAll?.filter((item) => item.type === 1)
        : subnetInforAll;

    const lockTimeReach = useMemo(() => {
      if (
        subnetInforAll &&
        learningId &&
        learnSecond !== undefined &&
        learnSecond[0] >=
          Number(
            subnetInforAll.find(
              (item: SubnetInfoType) => item.subnetId === learningId
            )?.lockup
          )
      ) {
        return true;
      }
      return false;
    }, [subnetInforAll, learningId, learnSecond]);

    useEffect(() => {
      onSendLoading && onSendLoading(learningTimeLoading);
    }, [learningTimeLoading]);

    const showModal = (event: any, hubItem: SubnetInfoType) => {
      event.preventDefault();
      if (isConnected) {
        startModalRef.current?.cliskSetCurrentHub(hubItem);
        startModalRef.current?.clickStartConfirmModal();
      } else {
        openConnectModal?.();
      }
    };
    console.log("agentTokenId", agentTokenId);

    return (
      <div>
        {loading ? (
          <div className="text-center mt-[40px] text-white">loading...</div>
        ) : subnetInfor?.length === 0 ? (
          <div className="text-center text-white">Coming soon...</div>
        ) : (
          <Row
            className="mt-[40px]"
            gutter={[
              { xs: 8, sm: 16, md: 20, lg: 30, xl: 50 },
              { xs: 10, sm: 16, md: 20, lg: 30, xl: 50 },
            ]}
          >
            {subnetInfor?.map((item: any) => (
              <Col
                key={item.subnetId}
                xs={{ span: 24 }}
                md={{ span: 12 }}
                lg={{ span: 8 }}
              >
                <Link
                  href={`/agenticworld/${item.subnetId}`}
                  onClick={(event) => linkToDetial(event, item.canLinkDetial)}
                >
                  <div
                    className={`relative flex flex-col justify-between gap-[30px] xl:px-[40px] px-[20px] 2xl:py-[40px] py-[20px] h-full ${
                      filter === 1 || filter === 2
                        ? "bg-[#0d1313] hub-box"
                        : "bg-[#0c0e14] hub-box2"
                    } bg-no-repeat bg-right-bottom bg-cover ${
                      isLaunch &&
                      learningId &&
                      item.subnetId !== learningId &&
                      learnSecond !== undefined &&
                      !lockTimeReach
                        ? "opacity-[0.5]"
                        : ""
                    }`}
                  >
                    <div>
                      <div
                        className={`flex items-center mb-[20px] justify-end ${
                          (
                            item.subnetId === 5 &&
                            (chainId === 192940 || chainId === 228)
                              ? false
                              : item.subnetId === 5 &&
                                (chainId === 56 || chainId === 97)
                              ? item.isAccess
                              : item.isAccess
                          )
                            ? "hidden"
                            : ""
                        }`}
                      >
                        <CommingSoon />
                      </div>
                      <div className="flex items-center gap-[5px] justify-between">
                        <div className="flex items-center gap-[5px] w-full flex-wrap">
                          <img
                            src={item.logo}
                            alt="logo"
                            className="rounded-[50%] w-[18%]"
                          />
                          <span className="text-[18px] text-white font-[800] leading-[1.2] break-word">
                            {item.subnetName}
                          </span>
                        </div>
                      </div>
                      {filter === 1 || (filter === 2 && !isLaunch) ? (
                        <div className="mt-[20px] flex justify-between gap-[5] flex-wrap">
                          <span className="text-[var(--mind-brand)] text-[18px]">
                            {item.subnetLevel}
                          </span>
                          <div
                            className={`text-white ${
                              learningId &&
                              item.subnetId === learningId &&
                              learnSecond !== undefined &&
                              !lockTimeReach
                                ? ""
                                : "hidden"
                            }`}
                          >
                            <Lock />
                          </div>
                        </div>
                      ) : (
                        <div className="text-[14px] text-[#C7C7C7] mt-[20px] hub-text-ellipsis">
                          {item.subnetInfo}
                        </div>
                      )}
                      <div className="relative z-10">
                        <div className="mt-[30px] text-white text-[14px]">
                          <div className="flex justify-between gap-[3px]">
                            <span>APY:</span>
                            <span className="break-words max-w-[80%] whitespace-normal text-right">
                              {filter === 3 &&
                              item.subnetId !== 4 &&
                              item.subnetId !== 5
                                ? "/"
                                : item.payoutRatio}
                            </span>
                          </div>
                          {/* <div className="flex justify-between gap-[3px]">
                          <span>Enrolled Agents:</span>
                          <span>{filter === 3 ? "/" : item.agent}</span>
                        </div> */}
                          <div className="flex justify-between gap-[3px]">
                            <span>Training Lock-up:</span>
                            <span>
                              {filter === 3 &&
                              item.subnetId !== 4 &&
                              item.subnetId !== 5
                                ? "/"
                                : secondsToHours(item.lockup) + " H"}
                            </span>
                          </div>
                          <div
                            className={`flex justify-between gap-[3px] items-start ${
                              item.subnetRequire ? "" : "hidden"
                            }`}
                          >
                            <span>Require:</span>
                            <div className="text-right text-[var(--mind-brand)]">
                              {item.subnetRequire}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="relative z-10">
                      {learningId && item.subnetId === learningId ? (
                        <div className="flex items-center justify-end">
                          <span className="text-[var(--mind-brand)]">
                            Training
                          </span>
                          <img src="/icons/cz.svg" alt="cz" width={25} />
                        </div>
                      ) : ((agentTokenId !== undefined &&
                          agentTokenId !== 0 &&
                          learningId === 0) ||
                          lockTimeReach ||
                          !address) &&
                        (item.subnetId === 5 &&
                        (chainId === 192940 || chainId === 228)
                          ? false
                          : item.subnetId === 5 &&
                            (chainId === 56 || chainId === 97)
                          ? item.isAccess
                          : item.isAccess) ? (
                        <div className="text-white text-[14px] font-[600] flex items-center justify-end">
                          <span
                            onClick={(event) => showModal(event, item)}
                            className="hover:text-[var(--mind-brand)]"
                          >
                            {item.type === 0
                              ? "Start Training"
                              : "Start Working"}
                          </span>
                        </div>
                      ) : (
                        <div className="text-[var(--mind-grey)] text-[14px] font-[600] flex items-center justify-end">
                          <span>
                            {item.type === 0
                              ? "Start Training"
                              : "Start Working"}
                          </span>
                        </div>
                      )}
                    </div>
                    <img
                      src={
                        filter === 1 || filter === 2
                          ? "icons/hub-icons-1.svg"
                          : "icons/hub-icons-2.svg"
                      }
                      className="absolute right-0 bottom-0"
                      alt="hub-icons"
                    />
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
          subnetList={subnetList}
          refreshHubAgentCount={refreshHubAgentCount}
        />
      </div>
    );
  }
);

HubList.displayName = "StakeLaunch";
export default HubList;
