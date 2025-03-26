import { useAgentGetMeta, useUserTransaction } from "@/sdk";
import { Table, TableColumnsType } from "antd";
import React from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { formatEther } from "viem";
import { numberDigits } from "@/utils/utils";
import useAgentGetTokenIdStore from "@/store/useAgentGetTokenId";

dayjs.extend(utc);

export default function Transaction() {
  const agentTokenId = useAgentGetTokenIdStore((state) => state.agentTokenId);
  const { data, loading, pagination } = useUserTransaction();
  const { data: agentMeta, loading: agentMetaLoading } = useAgentGetMeta({
    agentId: agentTokenId,
  });
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
      // render: () => (
      //   <span className="text-[12px] text-light">
      //     {agentMetaLoading
      //       ? "loading..."
      //       : !agentMeta
      //       ? "CitizenZ_0"
      //       : agentMeta.agentName}
      //   </span>
      // ),
      render: () => <span className="text-[12px] text-light">CitizenZ_0</span>,
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
