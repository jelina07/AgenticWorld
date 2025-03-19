"use client";
import { Table, TableColumnsType } from "antd";
import Lock from "@/components/utils/Lock";
import { useHubGetCurrent, useHubList } from "@/sdk";
import useAgentGetTokenIdStore from "@/store/useAgentGetTokenId";
import useGetLearningHubId from "@/store/useGetLearningHubId";

const tableColumns: TableColumnsType = [
  {
    title: "Basic Hub",
    dataIndex: "subnetName",
    render: (value: string, record: any) => (
      <div className="flex items-center gap-[5px]">
        <img src={record.subnetLogo} alt="logo" />
        <span className="text-[14px] text-white mr-[10px]">{value}</span>
        <div
          className={`${
            record.status === "Training" &&
            Number(record.currentLearned) !== Number(record.lockupHours)
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
    title: "Status",
    dataIndex: "status",
  },
  {
    title: "Lock up Learning Hours",
    dataIndex: "lockupHours",
  },
  {
    title: "Current Learned",
    dataIndex: "currentLearned",
  },
  {
    title: "Rewards",
    dataIndex: "rewards",
  },
];
export default function HubRecord() {
  const { data: hubList, loading } = useHubList();
  console.log("hubList", hubList);
  const agentTokenId = useAgentGetTokenIdStore((state) => state.agentTokenId);
  const { loading: learningIdLoading } = useHubGetCurrent({
    tokenId: agentTokenId,
  });

  const learningId = useGetLearningHubId((state) => state.learningHubId);
  const tableData = hubList?.map((item: any) => {
    const status = item.id === learningId ? "Training" : "Exit";
    return {
      subnetId: item.id,
      subnetName: item.name,
      subnetLogo: "/icons/fcn.svg",
      status: learningIdLoading && learningId === 0 ? "loading..." : status,
      lockupHours: item.lockUp,
      currentLearned: "2",
      rewards: "0.3 FHE",
    };
  });

  return (
    <div className="mind-table mt-[50px]">
      <div className="text-[18px] font-[800] mb-[30px]">
        Hub Training Record
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
