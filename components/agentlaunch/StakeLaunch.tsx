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

const successTip = "Launch Success !";

const StakeLaunch = forwardRef((_, ref) => {
  const { chainId, isConnected, address } = useAccount();
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
  const { runAsync: relayerAgentStake } = useRelayerStake();
  const {
    data: status,
    run: statusRun,
    cancel: statusCancel,
  } = useRelayerGetStatus("stake");
  const [actionLoop, setActionLoop] = useState(false);

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

  // useAsyncEffect(async () => {
  //   if (address) {
  //     // have stake
  //     if (stakeStatus !== undefined) {
  //       if (stakeStatus.status === "1") {
  //         stakeStatusCancel();
  //         await new Promise((resolve) => setTimeout(resolve, 5000));
  //         agentGetTokenIdRefresh();
  //         fheBalanceRefresh();
  //         refreshTotalAgent();
  //         setStakeLoop(false);
  //         notification.success({
  //           message: "Success",
  //           description: "Launch Success !",
  //         });
  //       } else if (stakeStatus.status === "-1") {
  //         stakeStatusCancel();
  //         if (stakeStatus.message) {
  //           notification.error({
  //             message: "Error",
  //             description: stakeStatus.message,
  //           });
  //         } else if (stakeStatus.errorCode) {
  //           const errorMess = Agent1ContractErrorCode(stakeStatus.errorCode);
  //           notification.error({
  //             message: "Error",
  //             description: errorMess,
  //           });
  //         }
  //         setStakeLoop(false);
  //       } else {
  //         setStakeLoop(true);
  //       }
  //     }
  //   }
  // }, [stakeStatus]);

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
              Total Agents Launched:{" "}
              {!isConnected ? "/" : !totalAgent ? "loading..." : totalAgent}
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
            disabled={isAgent || amount === ""}
            onClick={stake}
            loading={agentStakeLoading || actionLoop}
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
