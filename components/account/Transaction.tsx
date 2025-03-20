import { useUserTransaction } from "@/sdk";
import { Table, TableColumnsType } from "antd";
import React from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { formatEther } from "viem";
import { numberDigits } from "@/utils/utils";

dayjs.extend(utc);

const tableColumns: TableColumnsType = [
  {
    title: "Token",
    dataIndex: "amount",
    render: (amount) => amount && numberDigits(formatEther(BigInt(amount))),
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
export default function Transaction() {
  const { data, loading, pagination } = useUserTransaction();
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
