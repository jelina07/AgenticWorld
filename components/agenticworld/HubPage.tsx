"use client";
import { Collapse, CollapseProps } from "antd";
import React, { useRef, useState } from "react";
import HubList from "./HubList";
import { useHubList } from "@/sdk";
import useHubAgentCount from "@/sdk/hooks/useHubAgentCount";
import { useRouter } from "next/navigation";

export default function HubPage() {
  const [loading, setLoading] = useState(false);
  const hublist: any = useRef(null);
  const refreshClick = (event: any) => {
    event.stopPropagation();
    // hublist.current?.refreshLearningTime();
    window.location.reload();
  };
  const handleChildLoading = (value: boolean) => {
    setLoading(value);
    console.log("value", value);
  };
  console.log("loadingloading", loading);

  const items: CollapseProps["items"] = [
    {
      key: "1",
      label: (
        <div className="flex gap-[10px]">
          <div className="text-left text-[18px] sm:text-[26px] text-white font-[800]">
            Start Training with Basic Hub
          </div>
          <img
            src="/icons/refresh.svg"
            alt="refresh"
            onClick={refreshClick}
            width={20}
            className={`cursor-pointer ${
              loading ? "refresh" : ""
            } relative z-[10]`}
          />
        </div>
      ),
      children: (
        <div className="md:px-[20px]">
          <HubList
            filter={2}
            ref={hublist}
            onSendLoading={handleChildLoading}
          ></HubList>
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <div className="flex gap-[10px]">
          <div className="text-left text-[18px] sm:text-[26px] text-white font-[800]">
            Earn More with Advance Hub
          </div>
          <img
            src="/icons/refresh.svg"
            alt="refresh"
            onClick={refreshClick}
            width={20}
            className={`cursor-pointer ${
              loading ? "refresh" : ""
            } relative z-[10]`}
          />
        </div>
      ),
      children: (
        <div className="md:px-[20px]">
          <HubList
            filter={3}
            ref={hublist}
            onSendLoading={handleChildLoading}
          ></HubList>
        </div>
      ),
    },
  ];

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
