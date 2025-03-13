"use client";
import { Table, TableColumnsType } from "antd";
import Lock from "@/components/utils/Lock";

const tableColumns: TableColumnsType = [
  {
    title: "Basic Hub",
    dataIndex: "subnetName",
    render: (value, record) => (
      <div className="flex items-center gap-[5px]">
        <img src={record.subnetLogo} alt="logo" />
        <span className="text-[14px] text-white mr-[10px]">{value}</span>
        <Lock />
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
  const tableData = [
    {
      subnetId: "1",
      subnetName: "FDN",
      subnetLogo: "/icons/fcn.svg",
      status: "Training",
      lockupHours: "72",
      currentLearned: "2",
      rewards: "0.3 FHE",
    },
    {
      subnetId: "2",
      subnetName: "FCN",
      subnetLogo: "/icons/fcn.svg",
      status: "Exit",
      lockupHours: "72",
      currentLearned: "72",
      rewards: "0.3 FHE",
    },
  ];
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
      />
    </div>
  );
}
