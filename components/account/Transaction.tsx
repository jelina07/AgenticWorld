import { useAgentGetAllChainMeta, useUserTransaction } from "@/sdk";
import { Table, TableColumnsType } from "antd";
import React, { useEffect } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { formatEther } from "viem";
import { numberDigits } from "@/utils/utils";
import useAgentGetTokenIdStore from "@/store/useAgentGetTokenId";
import { chains, supportChainId } from "@/sdk/wagimConfig";
import useControlModal from "@/store/useControlModal";
import { useAsyncEffect } from "ahooks";

dayjs.extend(utc);

export default function Transaction() {
  const { accountModalopen, setIsAccountModalopen } = useControlModal();
  const agentTokenId = useAgentGetTokenIdStore((state) => state.agentTokenId);
  const { data, loading, pagination } = useUserTransaction();
  // const {
  //   data: agentMetas,
  //   loading: agentMetaLoading,
  //   refreshAsync,
  // } = useAgentGetAllChainMeta(agentTokenId, supportChainId);
  // console.log("agentMetas", agentMetas, supportChainId);

  const tableColumns: TableColumnsType = [
    {
      title: "Token",
      dataIndex: "amount",
      render: (amount) => amount && numberDigits(formatEther(BigInt(amount))),
    },
    {
      title: "Type",
      dataIndex: "type",
      render: (value, record) => (
        <div className="flex items-center gap-[5px]">
          <img
            src={
              chains.find((item: any) => item.id === record.chain_id).iconUrl
            }
            alt="chian-icon"
            width={12}
          />
          <span>{value}</span>
        </div>
      ),
    },
    {
      title: "Agent",
      dataIndex: "agent",
      render: (_, record) => (
        <span className="text-[12px] text-light">
          {/* {agentMetaLoading
            ? "loading..."
            : !agentMetas?.find((item: any) => item.chainId === record.chain_id)
                .agentMeta
            ? "CitizenZ_0"
            : agentMetas?.find((item: any) => item.chainId === record.chain_id)
                .agentMeta.agentName} */}
          CitizenZ_0
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: () => "Success",
    },
    {
      title: "Time",
      dataIndex: "time",
      render: (time) =>
        time && dayjs(new Date(time)).format("HH:mm:ss DD/MM/YYYY"),
    },
  ];
  console.log("Transactiondata", data);
  // useAsyncEffect(async () => {
  //   if (accountModalopen) {
  //     await refreshAsync();
  //   }
  // }, [accountModalopen]);
  return (
    <div className="mind-table transaction-table mt-[20px]">
      <Table
        className="mt-[20px]"
        dataSource={data?.list}
        columns={tableColumns}
        pagination={pagination}
        bordered={false}
        loading={loading}
        rowKey="txn_hash"
        scroll={{ x: 400, y: 250 }}
      />
    </div>
  );
}
