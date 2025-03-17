import { useAgentGetTokenId, useAgentStake } from "@/sdk";
import useAgentGetTokenIdStore from "@/store/useAgentGetTokenId";
import { checkAmountControlButtonShow } from "@/utils/utils";
import { Button, Input, message } from "antd";
import React, { useState } from "react";
import { useAccount } from "wagmi";

export default function StakeLaunch() {
  const [amount, setAmount] = useState("");
  const { runAsync: agentStake, loading: agentStakeLoading } = useAgentStake({
    waitForReceipt: true,
  });

  const { loading: agentTokenIdLoading, refresh: agentGetTokenIdRefresh } =
    useAgentGetTokenId();

  const agentTokenId = useAgentGetTokenIdStore((state) => state.agentTokenId);
  const isAgent = agentTokenId !== 0;
  const stake = async () => {
    if (checkAmountControlButtonShow(amount)) {
      if (Number(amount) < 100) {
        message.open({
          type: "warning",
          content: "The minimum amount entered is 100",
          duration: 5,
        });
      } else {
        const res = await agentStake(agentTokenId!, amount);
        if (res) {
          agentGetTokenIdRefresh();
        }
      }
    }
  };
  return (
    <div
      className="p-[24px] mt-[50px] mind-input max-w-[775px] mx-auto flex justify-between gap-[30px] flex-wrap
                    bg-[url('/images/agent-launch-bg.png')] cover"
    >
      <img src="/icons/ai-agent.svg" alt="ai-agent" />
      <div>
        <div className="text-[18px] font-[800]">Launch Your AI Agent</div>
        <div className="text-[14px] mt-[20px]">
          <div>Minimum staking: 100 $FHE</div>
          <div className="mt-[10px]">
            Rewards: 15% $FHE of Mind Pool & Potential Partner tokens
          </div>
        </div>
        <Input
          style={{ height: "45px", margin: "26px 0" }}
          disabled={isAgent}
          value={amount}
          onChange={(e: any) => {
            setAmount(e.target.value);
          }}
        />
        <div className="flex items-end gap-[10px]">
          <Button
            type="primary"
            className="button-brand-border"
            disabled={isAgent || amount === ""}
            onClick={stake}
            loading={agentStakeLoading}
          >
            Stake
          </Button>
          <a
            href="http://"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12px] text-[var(--mind-brand)] hover:text-[var(--mind-brand)] whitespace-nowrap underline hover:underline"
          >
            Buy $FHE
          </a>
        </div>
      </div>
    </div>
  );
}
