import { Table, TableColumnsType } from "antd";
import React from "react";

const tableColumns: TableColumnsType = [
  {
    title: "Token",
    dataIndex: "token",
  },
  {
    title: "type",
    dataIndex: "type",
  },
  {
    title: "Agent",
    dataIndex: "agent",
  },
  {
    title: "Status",
    dataIndex: "status",
  },
  {
    title: "Time",
    dataIndex: "time",
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
  return (
    <div className="mind-table transaction-table mt-[40px]">
      <Table
        className="mt-[20px]"
        dataSource={tableData}
        columns={tableColumns}
        pagination={false}
        bordered={false}
        rowKey={"subnetId"}
        scroll={{ x: 400 }}
      />
    </div>
  );
}
