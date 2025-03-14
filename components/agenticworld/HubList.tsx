import { Col, Row } from "antd";
import React from "react";
import Link from "next/link";
import Arraw from "@/public/icons/arraw.svg";
import Lock from "@/components/utils/Lock";

export default function HubList({
  subnetInfor,
  isBasic,
  isLaunch = false,
}: {
  subnetInfor: any;
  isBasic: boolean;
  isLaunch?: boolean;
}) {
  const learningId = 1;
  const lockTimeReach = false;
  return (
    <div>
      {
        // loading ? (
        //   <div className="text-center mt-[10px]">loading...</div>
        // ) :
        subnetInfor?.length === 0 ? (
          <div className="text-center">Coming soon...</div>
        ) : (
          <Row className="mt-[20px]" gutter={[16, { xs: 16, sm: 16, md: 24 }]}>
            {subnetInfor?.map((item: any) => (
              <Col
                key={item.subnetId}
                xs={{ span: 24 }}
                md={{ span: 12 }}
                lg={{ span: 8 }}
              >
                <div
                  className={`p-[40px] h-full ${
                    isBasic
                      ? "bg-[url('/icons/subnet-box1.svg')]"
                      : "bg-[url('/icons/subnet-box2.svg')]"
                  } bg-no-repeat bg-right-bottom border bg-cover`}
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
                        item.subnetId === learningId && !lockTimeReach
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
                        {item.subnetRequire?.map((obj: any, index: number) => (
                          <div className="text-[var(--mind-brand)]" key={index}>
                            [{obj}]
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  {item.subnetId === learningId ? (
                    <div className="flex items-center mt-[30px] justify-end">
                      <span className="text-[var(--mind-brand)]">Learning</span>
                      <img src="/icons/cz.svg" alt="cz" width={25} />
                    </div>
                  ) : !lockTimeReach ? (
                    <div className="text-[var(--mind-grey)] text-[14px] font-[600] flex items-center mt-[30px] justify-end">
                      <span>Start</span>
                      <Arraw className="fill-[var(--mind-grey)]"></Arraw>
                    </div>
                  ) : (
                    <Link
                      href={`/agenticworld/${item.subnetId}`}
                      className="text-white hover:text-white text-[14px] font-[600] flex items-center mt-[30px] justify-end"
                    >
                      <span>Start</span>
                      <Arraw></Arraw>
                    </Link>
                  )}
                </div>
              </Col>
            ))}
          </Row>
        )
      }
    </div>
  );
}
