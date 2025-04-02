"use client";

import {
  useAgentGetStakeAmount,
  useAgentGetTokenId,
  useAgentStake,
  useAirdropCheck,
  useAirdropClaim,
  useAirdropRelayerClaim,
  useHubDelegate,
  useHubGetCurrent,
  useHubGetCurrentExp,
  useHubList,
  useRelayerClaimReward,
  useRelayerStake,
  useRelayerSwitchHub,
  useRelayerUnstake,
} from "@/sdk";
import useHubExitCurrent from "@/sdk/hooks/useHubExitCurrent";
import useRelayerBurn from "@/sdk/hooks/useRelayerBurn";
import useRelayerDelegate from "@/sdk/hooks/useRelayerDelegate";
import useRelayerExitCurrentHub from "@/sdk/hooks/useRelayerExitCurrentHub";
import { Button, Card, Flex, Input } from "antd";
import { useState } from "react";

export default function DemoPage() {
  const { data: agentTokenId, loading: agentTokenIdLoading, refresh } = useAgentGetTokenId();

  const { runAsync: agentStake, loading: agentStakeLoading } = useAgentStake({
    waitForReceipt: true,
  });

  const { data: agentStakeAmount, refresh: agentStakeAmountRefresh } = useAgentGetStakeAmount({
    tokenId: agentTokenId,
  });

  const { runAsync: relayerStake } = useRelayerStake();

  const { runAsync: relayerUnstake, loading: relayerUnstakeLoading } = useRelayerUnstake();

  const { runAsync: relayerBurn, loading: relayerBurnLoading } = useRelayerBurn();

  const { runAsync: relayerDelegate, loading: relayerDelegateLoading } = useRelayerDelegate();

  const { runAsync: relayerExitCurrentHub, loading: relayerExitCurrentHubLoading } = useRelayerExitCurrentHub();

  const { runAsync: relayerSwitchHub, loading: relayerSwitchHubLoading } = useRelayerSwitchHub();

  const { runAsync: relayerClaimReward, loading: relayerClaimRewardLoading } = useRelayerClaimReward({});

  const onAgentStake = async () => {
    const res = await relayerStake(agentTokenId!, "100");
    if (res) {
    }
  };

  const onAgentUnstake = async () => {
    const res = await relayerUnstake(agentTokenId!, "100");
    if (res) {
    }
  };

  const onAgentBurn = async () => {
    const res = await relayerBurn(agentTokenId!);
    if (res) {
    }
  };

  const onAgentDelegate = async () => {
    const res = await relayerDelegate(agentTokenId!, 1);
    if (res) {
    }
  };

  const onAgentExitCurrentHub = async () => {
    const res = await relayerExitCurrentHub(agentTokenId!);
    if (res) {
    }
  };

  const onAgentSwitchHub = async () => {
    const res = await relayerSwitchHub(agentTokenId!, 3);
    if (res) {
    }
  };

  const onAgentClaimReward = async () => {
    const res = await relayerClaimReward();
    console.log("🚀 ~ onAgentClaimReward ~ res:", res);
    if (res) {
    }
  };

  return (
    <div className="px-[var(--layout-sm)] md:px-[var(--layout-md)] lg:px-[var(--layout-lg)] text-white">
      <Card title="Agent Lanuch" className="!mt-6">
        <div>
          Agent Token Id: {agentTokenId}{" "}
          {!agentTokenIdLoading && (
            <>
              <Button onClick={onAgentStake} type="primary" loading={agentStakeLoading}>
                Stake
              </Button>
              <Button onClick={onAgentUnstake} type="primary" loading={relayerUnstakeLoading}>
                unStake
              </Button>

              <Button onClick={onAgentBurn} type="primary" loading={relayerBurnLoading}>
                burn
              </Button>

              <Button onClick={onAgentDelegate} type="primary" loading={relayerDelegateLoading}>
                delegate
              </Button>

              <Button onClick={onAgentExitCurrentHub} type="primary" loading={relayerExitCurrentHubLoading}>
                exit current hub
              </Button>

              <Button onClick={onAgentSwitchHub} type="primary" loading={relayerSwitchHubLoading}>
                switch hub
              </Button>

              <Button onClick={onAgentClaimReward} type="primary" loading={relayerClaimRewardLoading || fetchLoading}>
                claim reward
              </Button>
            </>
          )}
        </div>
        <div>Agent Stake Amount: {agentStakeAmount}</div>
      </Card>
    </div>
  );
}
