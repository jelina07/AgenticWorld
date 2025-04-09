"use client";
import { Table, TableColumnsType } from "antd";
import Lock from "@/components/utils/Lock";
import { useHubGetCurrent, useHubGetCurrentExp, useHubGetReward } from "@/sdk";
import useAgentGetTokenIdStore from "@/store/useAgentGetTokenId";
import useGetLearningHubId from "@/store/useGetLearningHubId";
import { numberDigits, secondsToHours } from "@/utils/utils";

export default function HubRecord({
  ids,
  loading,
  hubList,
}: {
  ids: any[];
  loading: boolean;
  hubList?: any[];
}) {
  const agentTokenId = useAgentGetTokenIdStore((state) => state.agentTokenId);
  const {
    learnSecond,
    refresh: refreshLearnTime,
    loading: learnSecondLoading,
  } = useHubGetCurrentExp({
    tokenId: agentTokenId,
    hubIds: ids,
  });
  const { loading: learningIdLoading } = useHubGetCurrent({
    tokenId: agentTokenId,
  });
  const {
    data: rewards,
    refresh: refreshrewards,
    loading: rewardsLoading,
  } = useHubGetReward({
    hubIds: ids,
    tokenId: agentTokenId,
  });

  const tableColumns: TableColumnsType = [
    {
      title: "Basic Hub",
      dataIndex: "subnetName",
      render: (value: string, record: any) => (
        <div className="flex items-center gap-[5px]">
          <img
            src={record.subnetLogo}
            alt="logo"
            width={30}
            className="rounded-[50%]"
          />
          <a
            href={`/agenticworld/${record.subnetId}`}
            className="text-[14px] mr-[10px] underline text-white hover:underline hover:text-white"
          >
            {value}
          </a>
          <div
            className={`${
              record.subnetId === learningId &&
              Number(record.currentLearned) < Number(record.lockupHours)
                ? ""
                : "hidden"
            }`}
          >
            <Lock />
          </div>
        </div>
      ),
    },
    {
      title: "Rewards",
      dataIndex: "rewards",
      render: (value: any) => (
        <div>
          {value}
          <span className="text-[var(--mind-grey)]"> FHE</span>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (_, record: any) => (
        <span>
          {learningIdLoading && learningId === 0 && learnSecondLoading
            ? "loading..."
            : record.subnetId === learningId
            ? "Training"
            : record.currentLearned === 0
            ? "/"
            : "Exit"}
        </span>
      ),
    },
    {
      title: "Training Lock-up",
      dataIndex: "lockupHours",
      render: (value: number) => (
        <div>
          {secondsToHours(value)}
          <span className="text-[var(--mind-grey)]"> H</span>
        </div>
      ),
    },
    {
      title: "Currently Trained",
      dataIndex: "currentLearned",
      render: (value: number | string) => (
        <div>
          {secondsToHours(value)}
          <span className="text-[var(--mind-grey)]"> H</span>
        </div>
      ),
    },
  ];

  const learningId = useGetLearningHubId((state) => state.learningHubId);
  const tableDataAll =
    (agentTokenId &&
      hubList?.map((item: any, index: number) => {
        // const status = item.id === learningId ? "Training" : "Exit";
        const currentLearned = learnSecondLoading
          ? "loading..."
          : learnSecond && learnSecond[index];
        const currentRewards = rewardsLoading
          ? "loading..."
          : rewards && numberDigits(rewards[index]);
        return {
          subnetId: item.id,
          subnetName: item.name,
          subnetLogo: item.logo,
          // status: learningIdLoading && learningId === 0 ? "loading..." : status,
          status: "",
          lockupHours: item.lockUp,
          subnetLevel: item.note,
          currentLearned: currentLearned,
          rewards: currentRewards,
          type: item.type,
        };
      })) ||
    [];
  const tableData = tableDataAll?.filter(
    (item: any) => item.type === 0 || item.currentLearned > 0
  );

  const refresh = () => {
    refreshLearnTime();
    refreshrewards();
  };

  return (
    <div className="mind-table mt-[50px]">
      <div className="text-[18px] font-[800] mb-[30px] flex items-center gap-[2px]">
        <span>Hub Training Record</span>
        <img
          src="/icons/refresh.svg"
          alt="refresh"
          onClick={refresh}
          className={`cursor-pointer ${
            learnSecondLoading || rewardsLoading ? "refresh" : ""
          }`}
        />
      </div>
      <Table
        className="mt-[20px]"
        dataSource={tableData}
        columns={tableColumns}
        pagination={false}
        bordered={false}
        rowKey={"subnetId"}
        scroll={{ x: 764 }}
        loading={loading}
      />
    </div>
  );
}
