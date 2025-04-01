import {
  useAgentGetTokenId,
  useAgentStake,
  useGetFheBalance,
  useGetAgentCount,
} from "@/sdk";
import { isDev, isProd } from "@/sdk/utils";
import useAgentGetTokenIdStore from "@/store/useAgentGetTokenId";
import useGetFheBalanceStore from "@/store/useGetFheBalanceStore";
import {
  checkAmountControlButtonShow,
  checkAmountControlButtonShowCan0,
  firstStakeAmount,
  numberDigits,
} from "@/utils/utils";
import { Button, Input, message, notification } from "antd";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import Facuet from "../facuet/Facuet";
import { useAccount } from "wagmi";
import { mindnet, mindtestnet } from "@/sdk/wagimConfig";

const StakeLaunch = forwardRef((_, ref) => {
  const { chainId } = useAccount();
  const startAmount = isDev() || isProd() ? "" : "0";
  const [amount, setAmount] = useState(startAmount);
  const { runAsync: agentStake, loading: agentStakeLoading } = useAgentStake({
    waitForReceipt: true,
  });
  const { refresh: agentGetTokenIdRefresh } = useAgentGetTokenId();

  const agentTokenId = useAgentGetTokenIdStore((state) => state.agentTokenId);
  const isAgent = agentTokenId !== 0;
  const { refresh: fheBalanceRefresh, loading } = useGetFheBalance();
  const { balance } = useGetFheBalanceStore();
  const { data: totalAgent, refresh: refreshTotalAgent } = useGetAgentCount();

  useImperativeHandle(ref, () => ({
    clearStakeAmount: () => {
      setAmount("");
    },
  }));

  const stake = async () => {
    if (checkAmountControlButtonShowCan0(amount)) {
      if (Number(amount) < firstStakeAmount) {
        message.open({
          type: "warning",
          content: `The minimum required amount is ${firstStakeAmount} !`,
          duration: 5,
        });
      } else if (Number(amount) > Number(balance)) {
        message.open({
          type: "warning",
          content: "The amount you enter is greater than your balance !",
          duration: 5,
        });
      } else {
        const res = await agentStake(agentTokenId!, amount);
        if (res) {
          agentGetTokenIdRefresh();
          fheBalanceRefresh();
          refreshTotalAgent();
          notification.success({
            message: "Success",
            description:
              isDev() || isProd() ? "Stake Success !" : "Launch Success !",
          });
        }
      }
    }
  };

  return (
    <div
      className="p-[24px] mind-input max-w-[850px] mx-auto flex justify-between gap-[30px] flex-wrap
                        bg-[url('/images/agent-launch-bg.png')] bg-cover bg-no-repeat"
    >
      <img src="/icons/ai-agent.svg" alt="ai-agent" />
      <div>
        <div className="text-[18px] font-[800]">Launch Your AI Agent</div>
        <div className="text-[14px] mt-[20px]">
          {isDev() || isProd() ? (
            <div>Minimum staking: {firstStakeAmount} $FHE</div>
          ) : (
            <div>
              Total Agents Launched: {!totalAgent ? "loading..." : totalAgent}
            </div>
          )}
          <div className="mt-[10px]">
            $FHE from Mind Network Ecosystem Incentive & Potential Partner
            tokens
          </div>
        </div>
        {isDev() || isProd() ? (
          <Input
            style={{ height: "45px", margin: "26px 0 0 0" }}
            disabled={isAgent}
            value={amount}
            onChange={(e: any) => {
              setAmount(e.target.value);
            }}
          />
        ) : (
          <div className="my-[26px]"></div>
        )}
        {isDev() || isProd() ? (
          <div className="flex justify-between mt-[10px] mb-[26px] text-[14px]">
            <span>FHE Balance:</span>
            <div className="flex items-center gap-[3px]">
              <span>
                {loading
                  ? "loading..."
                  : balance === undefined || numberDigits(balance) + " FHE"}
              </span>
              <img
                src="/icons/refresh.svg"
                alt="refresh"
                onClick={fheBalanceRefresh}
                className={`cursor-pointer ${loading ? "refresh" : ""}`}
              />
            </div>
          </div>
        ) : (
          <></>
        )}

        <div className="flex items-end gap-[10px]">
          <Button
            type="primary"
            className="button-brand-border"
            disabled={
              isAgent ||
              amount === "" ||
              chainId === mindnet.id ||
              chainId === mindtestnet.id
            }
            onClick={stake}
            loading={agentStakeLoading}
          >
            {isDev() || isProd() ? "Stake & Launch" : "Launch"}
          </Button>
          {isDev() || isProd() ? (
            <Facuet refreshFHE={fheBalanceRefresh} />
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
});

StakeLaunch.displayName = "StakeLaunch";
export default StakeLaunch;
