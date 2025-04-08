import {
  useAgentGetTokenId,
  useAgentStake,
  useGetFheBalance,
  useGetAgentCount,
  useRelayerStake,
  useRelayerGetStatus,
} from "@/sdk";
import { isDev, isProd } from "@/sdk/utils";
import useAgentGetTokenIdStore from "@/store/useAgentGetTokenId";
import useGetFheBalanceStore from "@/store/useGetFheBalanceStore";
import {
  $FHELockupperiod,
  checkAmountControlButtonShow,
  checkAmountControlButtonShowCan0,
  firstStakeAmount,
  judgeUseGasless,
  numberDigits,
} from "@/utils/utils";
import { Button, Input, message, notification } from "antd";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import Facuet from "../facuet/Facuet";
import { useAccount } from "wagmi";
import { mindnet, mindtestnet } from "@/sdk/wagimConfig";
import { useAsyncEffect } from "ahooks";
import { Agent1ContractErrorCode } from "@/sdk/utils/script";
import useRelayerStatusHandler from "@/hooks/useRelayerStatusHandler";
import Max from "../utils/Max";

const successTip = "Launch Success !";

const StakeLaunch = forwardRef((_, ref) => {
  const { chainId, isConnected, address } = useAccount();
  const [amount, setAmount] = useState("");
  const { runAsync: agentStake, loading: agentStakeLoading } = useAgentStake({
    waitForReceipt: true,
  });
  const { refresh: agentGetTokenIdRefresh } = useAgentGetTokenId();

  const agentTokenId = useAgentGetTokenIdStore((state) => state.agentTokenId);
  const isAgent = agentTokenId !== 0;
  const { refresh: fheBalanceRefresh, loading } = useGetFheBalance();
  const { balance } = useGetFheBalanceStore();
  const { data: totalAgent, refresh: refreshTotalAgent } = useGetAgentCount();
  const { runAsync: relayerAgentStake } = useRelayerStake();
  const {
    data: status,
    run: statusRun,
    cancel: statusCancel,
  } = useRelayerGetStatus("stake");
  const [actionLoop, setActionLoop] = useState(false);

  const clickMax = () => {
    setAmount(balance);
  };

  const afterSuccessHandler = () => {
    agentGetTokenIdRefresh();
    fheBalanceRefresh();
    refreshTotalAgent();
  };

  useRelayerStatusHandler(
    status,
    statusCancel,
    afterSuccessHandler,
    setActionLoop,
    successTip,
    Agent1ContractErrorCode
  );

  useImperativeHandle(ref, () => ({
    clearStakeAmount: () => {
      setAmount("");
    },
  }));

  const stake = async () => {
    if (checkAmountControlButtonShow(amount)) {
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
        if (judgeUseGasless(chainId)) {
          try {
            setActionLoop(true);
            const resId = await relayerAgentStake(agentTokenId!, amount);
            if (resId) {
              statusRun(chainId, resId);
            }
          } catch (error) {
            setActionLoop(false);
          }
        } else {
          const res = await agentStake(agentTokenId!, amount);
          if (res) {
            afterSuccessHandler();
            notification.success({
              message: "Success",
              description: successTip,
            });
          }
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
          <div>Minimum staking: {firstStakeAmount} $FHE</div>
          <div className="mt-[10px]">
            $FHE from Mind Network Ecosystem Incentive & Potential Partner
            tokens
          </div>
          <div className="mt-[10px]">
            $FHE Lock up period: {$FHELockupperiod} days
          </div>
        </div>

        <Input
          style={{ height: "45px", margin: "26px 0 0 0" }}
          disabled={isAgent}
          value={amount}
          suffix={
            <div onClick={clickMax} className="cursor-pointer">
              <Max />
            </div>
          }
          onChange={(e: any) => {
            setAmount(e.target.value.trim());
          }}
        />

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

        <div className="flex items-end gap-[10px]">
          <Button
            type="primary"
            className="button-brand-border"
            disabled={isAgent || amount === ""}
            onClick={stake}
            loading={agentStakeLoading || actionLoop}
          >
            Stake & Launch
          </Button>

          <Facuet refreshFHE={fheBalanceRefresh} />
        </div>
      </div>
    </div>
  );
});

StakeLaunch.displayName = "StakeLaunch";
export default StakeLaunch;
