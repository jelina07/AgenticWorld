"use client";
import Bridge from "@/components/swap&bridge/Bridge";
import { Tabs, TabsProps } from "antd";
import React from "react";
const items: TabsProps["items"] = [
  {
    key: "1",
    label: "Bridge",
    children: <Bridge />,
  },
  {
    key: "2",
    label: "Swap",
    children: "",
    disabled: true,
  },
];
export default function page() {
  const onChange = (key: string) => {
    console.log(key);
  };
  return (
    <div
      className="px-[var(--layout-sm)] md:px-[var(--layout-md)] lg:px-[var(--layout-lg)] xl:px-[var(--layout-xl)] 2xl:px-[var(--layout-2xl)] 
                    bg-[url('/icons/bridge-bg.svg')] bg-top bg-cover bg-no-repeat pb-[40px] min-h-[calc(100vh-160px)]
    "
    >
      <div className="max-w-[566px] mx-auto mind-tab pt-[40px]">
        <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
      </div>
    </div>
  );
}
