import React from "react";
import HubList from "../agenticworld/HubList";
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

const requiredHub = subnetInfor.filter(
  (item: any) => item.subnetLevel === "Required"
);
export default function RequiredHub() {
  return (
    <HubList subnetInfor={requiredHub} isBasic={true} isLaunch={true}></HubList>
  );
}
