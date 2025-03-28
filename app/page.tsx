"use client";
import HubRecord from "@/components/dashboard/HubRecord";
import MyAgent from "@/components/dashboard/MyAgent";
import RewardRule from "@/components/dashboard/RewardRule";
import ShutDownAgent from "@/components/dashboard/ShutDownAgent";
import { useHubList } from "@/sdk";
import { useMemo } from "react";

export default function Home() {
  const { data: hubList, loading } = useHubList();
  const ids = useMemo(() => {
    return hubList?.map((item: any) => item.id) || [];
  }, [hubList]);
  return (
    <div className="px-[var(--layout-sm)] md:px-[var(--layout-md)] lg:px-[var(--layout-lg)] xl:px-[var(--layout-xl)] 2xl:px-[var(--layout-2xl)]">
      <MyAgent ids={ids} hubList={hubList} />
      <div className="pb-[200px]">
        <HubRecord ids={ids} loading={loading} hubList={hubList} />
        <RewardRule />
      </div>
    </div>
  );
}
