"use client";

import {
  useAgentGetStakeAmount,
  useAgentGetTokenId,
  useAgentStake,
  useAirdropCheck,
  useAirdropClaim,
  useAirdropRelayerClaim,
  useHubDelegate,
  useHubList,
} from "@/sdk";
import { Button, Card, Flex, Input } from "antd";
import { useState } from "react";
import { formatEther, parseEther } from "viem";

export default function DemoPage() {
  const [checkWallet, setCheckWallet] = useState("");
  const { runAsync } = useAirdropCheck();
  const [checkRes, setCheckRes] = useState<unknown>();

  const { runAsync: relayerClaim } = useAirdropRelayerClaim();
  const { runAsync: claim } = useAirdropClaim({ waitForReceipt: true });
  const [relayerClaimRes, setRelayerClaimRes] = useState<unknown>();

  const { data: agentTokenId, loading: agentTokenIdLoading, refresh } = useAgentGetTokenId();

  const { runAsync: agentStake, loading: agentStakeLoading } = useAgentStake({ waitForReceipt: true });

  const { data: agentStakeAmount, refresh: agentStakeAmountRefresh } = useAgentGetStakeAmount({
    tokenId: agentTokenId as BigInt,
  });

  const { data: hubList } = useHubList();

  const { runAsync: hubDelegate } = useHubDelegate();

  const onCheckEligibility = async () => {
    const res = await runAsync(checkWallet);
    setCheckRes(res);
  };

  const onRelayerClaim = async () => {
    const res = await relayerClaim(checkWallet);
    setRelayerClaimRes(res);
  };

  const onClaim = async () => {
    const res = await claim(checkWallet, ["0x2e14f1d18456355969b58236e84c6d2468695cc29ce5423378071835fd3a7f92"]);
    setRelayerClaimRes(res);
  };

  const onAgentStake = async () => {
    const res = await agentStake(BigInt(agentTokenId as string), parseEther("100"));
    if (res) {
      refresh();
      agentStakeAmountRefresh();
    }
  };

  const onHubDelegate = async (hub: any) => {
    console.log("🚀 ~ onHubDelegate ~ hubId:", hub);
    const res = await hubDelegate({ tokenId: Number(agentTokenId as number), hubId: hub.id, needSign: hub.needSign });
  };

  return (
    <div className="px-[var(--layout-sm)] sm:px-[var(--layout-md)] text-white">
      <Card title="airdrop">
        <Flex gap={10}>
          <Input value={checkWallet} onChange={(e) => setCheckWallet(e.target.value)} />
          <Button type="primary" onClick={onCheckEligibility}>
            Check Eligibility
          </Button>
        </Flex>
        {(checkRes as string) && (
          <div>
            {JSON.stringify(checkRes)}
            <Button type="primary" onClick={onRelayerClaim}>
              Relayer Claim
            </Button>
            <Button type="primary" onClick={onClaim}>
              Claim
            </Button>
          </div>
        )}
        {(relayerClaimRes as string) && <div>{JSON.stringify(relayerClaimRes)}</div>}
      </Card>

      <Card title="Agent Lanuch" className="!mt-6">
        <div>
          Agent Token Id: {agentTokenId as string}{" "}
          {!agentTokenIdLoading && (
            <Button onClick={onAgentStake} type="primary" loading={agentStakeLoading}>
              Stake
            </Button>
          )}
        </div>
        <div>Agent Stake Amount: {(agentStakeAmount as bigint) && formatEther(agentStakeAmount as bigint)}</div>
      </Card>

      <Card title="Hub" className="!mt-6">
        {Array.isArray(hubList) &&
          hubList.map((hub) => (
            <div key={hub.id}>
              <div>
                Hub Name: {hub.name}{" "}
                <Button size="small" onClick={() => onHubDelegate(hub)} type="primary">
                  Start
                </Button>
              </div>
            </div>
          ))}
      </Card>
    </div>
  );
}
