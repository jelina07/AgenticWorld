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
    const { isConnected, address } = useAccount();
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

    const { data: hubAgentCount, refresh: refreshHubAgentCount } =
      useHubAgentCount({ hubIds: subnetList });
    const { data: hubApy } = useHubGetApy({ hubIds: subnetList });

    const subnetInforAll = subnetList?.map((item: any, index: number) => {
      return {
        subnetId: item.id,
        type: item.type,
        subnetName: item.name,
        subnetInfo: item.desc,
        agent: hubAgentCount ? hubAgentCount[index] : "loading...",
        payoutRatio: hubApy ? hubApy[index] : "loading...",
        lockup: item.lockUp,
        subnetLevel: item.note,
        subnetRequire: item.requireName,
        needSign: item.needSign,
        isAccess: item.isAccess,
        logo: item.logo,
      };
    }) as SubnetInfoType[];

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
              { xs: 8, sm: 20, md: 30, lg: 50 },
              { xs: 16, sm: 20, md: 30, lg: 50 },
            ]}
          >
            {subnetInfor?.map((item: any) => (
              <Col
                key={item.subnetId}
                xs={{ span: 24 }}
                md={{ span: 12 }}
                lg={{ span: 8 }}
              >
                <Link href={`/agenticworld/${item.subnetId}`}>
                  <div
                    className={`p-[30px] h-full ${
                      filter === 1 || filter === 2
                        ? "bg-[url('/icons/subnet-box1.svg')] hub-box"
                        : "bg-[url('/icons/subnet-box2.svg')] hub-box2"
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
                    <div className="flex items-center gap-[5px] justify-between">
                      <div className="flex items-center gap-[5px]">
                        {/* <span
                          className={`inline-block w-[16px] h-[16px] rounded-[50%] flex-shrink-0 ${
                            filter === 1 || filter === 2
                              ? "blue-gradient"
                              : "yellow-gradient"
                          }`}
                        ></span> */}
                        <img
                          src={item.logo}
                          alt="logo"
                          width={100}
                          className="rounded-[50%]"
                        />
                        <span className="text-[18px] text-white font-[800] leading-[1.2] text-wrap">
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
                      <div className="text-[14px] text-[#C7C7C7] mt-[20px]">
                        {item.subnetInfo}
                      </div>
                    )}

                    <div className="mt-[30px] text-white text-[14px]">
                      <div className="flex justify-between gap-[3px]">
                        <span>Payout Ratio:</span>
                        <span className="break-words max-w-[80%] whitespace-normal text-right">
                          {item.payoutRatio}
                        </span>
                      </div>
                      <div className="flex justify-between gap-[3px]">
                        <span>Enrolled Agents:</span>
                        <span>{item.agent}</span>
                      </div>
                      <div className="flex justify-between gap-[3px]">
                        <span>Training Lock-up:</span>
                        <span>{secondsToHours(item.lockup)} H</span>
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
                      item.isAccess ? (
                      <div className="text-white text-[14px] font-[600] flex items-center mt-[30px] justify-end">
                        <span
                          onClick={(event) => showModal(event, item)}
                          className="hover:text-[var(--mind-brand)]"
                        >
                          Start Training
                        </span>
                      </div>
                    ) : (
                      <div className="text-[var(--mind-grey)] text-[14px] font-[600] flex items-center mt-[30px] justify-end">
                        <span>Start Training</span>
                      </div>
                    )}
                  </div>
                </Link>
              </Col>
            ))}
            {/* <Col
              xs={{ span: 24 }}
              md={{ span: 12 }}
              lg={{ span: 8 }}
              className={`${filter === 3 ? "" : "hidden"} p-[30px] h-full`}
            >
              <div
                className="text-white flex justify-between items-center 
              bg-[url('/icons/subnet-box2.svg')]bg-no-repeat bg-right-bottom 
              bg-cover hub-box2"
              >
                <div>More Hubs will come in future</div>
              </div>
            </Col> */}
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
