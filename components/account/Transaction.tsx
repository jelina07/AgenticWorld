import { useUserTransaction } from "@/sdk";
import { Table, TableColumnsType } from "antd";
import React from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { formatEther } from "viem";

dayjs.extend(utc);

const tableColumns: TableColumnsType = [
  {
    title: "Token",
    dataIndex: "amount",
    render: (amount) => amount && formatEther(BigInt(amount)),
  },
  {
    title: "type",
    dataIndex: "type",
  },
  {
    title: "Agent",
    dataIndex: "agent",
    render: () => "CitizenZ_0",
  },
  {
    title: "Status",
    dataIndex: "status",
    render: () => "Success",
  },
  {
    title: "Time",
    dataIndex: "time",
    render: (time) => time && dayjs().utc(time).format("HH:mm:ss DD/MM/YYYY"),
  },
];
const tableData = [
  {
    subnetId: "1",
    token: "FDN",
    type: "Unstake",
    agent: "CitizenZ_0",
    status: "Success",
    time: "5:00:00 3/12/2025",
  },
  {
    subnetId: "2",
    token: "FDN",
    type: "Unstake",
    agent: "CitizenZ_0",
    status: "Success",
    time: "5:00:00 3/12/2025",
  },
];
export default function Transaction() {
  const { data, loading, pagination } = useUserTransaction({ address: "0x805A8ABc903A0861eb6BaA9955098D26477c215B" });
  console.log("🚀 ~ Transaction ~ data:", data);

  return (
    <div className="mind-table transaction-table mt-[40px]">
      <Table
        className="mt-[20px]"
        dataSource={data?.list}
        columns={tableColumns}
        pagination={pagination}
        bordered={false}
        loading={loading}
        rowKey={"subnetId"}
        scroll={{ x: 400 }}
      />
    </div>
  );
}
