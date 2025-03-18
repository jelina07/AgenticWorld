"use client";
import { Collapse, CollapseProps } from "antd";
import React from "react";
import HubList from "./HubList";
import { useHubList } from "@/sdk";

const subnetInfor: any = [
  {
    subnetId: 1,
    isBasic: 1,
    subnetName: "FCN - FHE Consensus",
    subnetInfo:
      "Data consensus agent. It is an agent leverage FHE technology during the data consensu process.....",
    payoutRatio: "15%",
    agent: 2000,
    lockup: "72H",
    subnetLevel: "Required",
    subnetRequire: null,
  },
  {
    subnetId: 2,
    isBasic: 1,
    subnetName: "FDN - FHE Consensus",
    subnetInfo:
      "Data consensus agent. It is an agent leverage FHE technology during the data consensu process.....",
    payoutRatio: "15%",
    agent: 2000,
    lockup: "72H",
    subnetLevel: "Required",
    subnetRequire: null,
  },
  {
    subnetId: 3,
    isBasic: 1,
    subnetName: "RandGen",
    subnetInfo:
      "Data consensus agent. It is an agent leverage FHE technology during the data consensu process.....",
    payoutRatio: "15%",
    agent: 2000,
    lockup: "72H",
    subnetLevel: "Required",
    subnetRequire: null,
  },
  {
    subnetId: 4,
    isBasic: 1,
    subnetName: "RandGen",
    subnetInfo:
      "Data consensus agent. It is an agent leverage FHE technology during the data consensu process.....",
    payoutRatio: "15%",
    agent: 2000,
    lockup: "72H",
    subnetLevel: "Optional",
    subnetRequire: null,
  },
  {
    subnetId: 5,
    isBasic: 0,
    subnetName: "RandGen",
    subnetInfo:
      "Data consensus agent. It is an agent leverage FHE technology during the data consensu process.....",
    payoutRatio: "15%",
    agent: 2000,
    lockup: "72H",
    subnetLevel: null,
    subnetRequire: ["RendGen"],
  },
  {
    subnetId: 6,
    isBasic: 0,
    subnetName: "RandGen",
    subnetInfo:
      "Data consensus agent. It is an agent leverage FHE technology during the data consensu process.....",
    payoutRatio: "15%",
    agent: 2000,
    lockup: "72H",
    subnetLevel: null,
    subnetRequire: ["RendGen", "FHE Data Lake"],
  },
  {
    subnetId: 7,
    isBasic: 0,
    subnetName: "RandGen",
    subnetInfo:
      "Data consensus agent. It is an agent leverage FHE technology during the data consensu process.....",
    payoutRatio: "15%",
    agent: 2000,
    lockup: "72H",
    subnetLevel: null,
    subnetRequire: ["RendGen", "FHE Data Lake"],
  },
];

const basicSubnet = subnetInfor.filter((item: any) => item.isBasic);
const advanceSubnet = subnetInfor.filter((item: any) => !item.isBasic);

export default function HubPage() {
  const { data: subnetList, loading } = useHubList({
    cacheKey: "useSubnetList",
    staleTime: 5 * 60 * 1000,
  });
  const items: CollapseProps["items"] = [
    {
      key: "1",
      label: (
        <div className="text-left text-[18px] sm:text-[26px] text-white font-[800] ">
          Start with Basic Hub
        </div>
      ),
      children: <HubList subnetInfor={basicSubnet} isBasic={true}></HubList>,
    },
    {
      key: "2",
      label: (
        <div className="text-left text-[18px] sm:text-[26px] text-white font-[800]">
          Earn More with Advance Hub
        </div>
      ),
      children: <HubList subnetInfor={advanceSubnet} isBasic={false}></HubList>,
    },
  ];

  const subnetInfor = subnetList?.map((item: any) => {
    return {
      subnetId: item.id,
      subnetName: item.name,
      subnetInfo: item.desc,
      lockup: item.lockUp,
    };
  });
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
