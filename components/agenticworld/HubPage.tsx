"use client";
import { Collapse, CollapseProps } from "antd";
import React from "react";
import HubList from "./HubList";
import { useHubList } from "@/sdk";
import useHubAgentCount from "@/sdk/hooks/useHubAgentCount";
export default function HubPage() {
  const { data: subnetList, loading } = useHubList({
    cacheKey: "useSubnetList",
    staleTime: 5 * 60 * 1000,
  });
  // const { data } = useHubAgentCount({ hubId: 1 });
  // console.log("data", data);

  const subnetInfor = subnetList?.map((item: any) => {
    return {
      subnetId: item.id,
      type: item.type,
      subnetName: item.name,
      subnetInfo: item.desc,
      lockup: item.lockUp,
      subnetLevel: item.note,
      subnetRequire: item.requireName,
      needSign: item.needSign,
    };
  }) as SubnetInfoType[];
  const basicSubnet = subnetInfor?.filter(
    (item: SubnetInfoType) => item.type === 0
  );
  const advanceSubnet = subnetInfor?.filter(
    (item: SubnetInfoType) => item.type === 1
  );
  const items: CollapseProps["items"] = [
    {
      key: "1",
      label: (
        <div className="text-left text-[18px] sm:text-[26px] text-white font-[800] ">
          Start Training with Basic Hub
        </div>
      ),
      children: <HubList filter={2}></HubList>,
    },
    {
      key: "2",
      label: (
        <div className="text-left text-[18px] sm:text-[26px] text-white font-[800]">
          Earn More with Advance Hub
        </div>
      ),
      children: <HubList filter={3}></HubList>,
    },
  ];

  console.log("subnetList", subnetList);

  return (
    <div className="mt-[40px]">
      <Collapse
        items={items}
        defaultActiveKey={["1", "2"]}
        bordered={false}
        className="mind-collapse mind-vote-collapse"
      />
    </div>
  );
}
