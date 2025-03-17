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
} from "@/sdk";
import useHubExitCurrent from "@/sdk/hooks/useHubExitCurrent";
import { Button, Card, Flex, Input } from "antd";
import { useState } from "react";

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
    tokenId: agentTokenId,
  });

  const { data: hubList } = useHubList();

  const { data: currentHub } = useHubGetCurrent({ tokenId: Number(agentTokenId as number) });

  const { runAsync: hubExitCurrent } = useHubExitCurrent();

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
    const res = await agentStake(agentTokenId!, 100);
    if (res) {
      refresh();
      agentStakeAmountRefresh();
    }
  };

  const onHubExitCurrent = async () => {
    const res = await hubExitCurrent(agentTokenId!);
    console.log("🚀 ~ onHubExitCurrent ~ res:", res);
  };

  const renderHubTitle = () => {
    return (
      <div>
        Hub {currentHub ? `current hub: ${currentHub}` : ""}
        {currentHub ? (
          <Button type="primary" size="small" onClick={onHubExitCurrent}>
            Exit
          </Button>
        ) : (
          ""
        )}
      </div>
    );
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
          Agent Token Id: {agentTokenId}{" "}
          {!agentTokenIdLoading && (
            <Button onClick={onAgentStake} type="primary" loading={agentStakeLoading}>
              Stake
            </Button>
          )}
        </div>
        <div>Agent Stake Amount: {agentStakeAmount}</div>
      </Card>

      <Card title={renderHubTitle()} className="!mt-6">
        {Array.isArray(hubList) &&
          agentTokenId &&
          hubList.map((hub) => <Hub key={hub.id} hub={hub} currentHub={currentHub} agentTokenId={agentTokenId} />)}
      </Card>
    </div>
  );
}

function Hub({ hub, agentTokenId, currentHub }: any) {
  const { runAsync: hubDelegate } = useHubDelegate();

  const { data: currentExp } = useHubGetCurrentExp({ tokenId: Number(agentTokenId as number), hubId: hub.id });

  const onHubDelegate = async (hub: any) => {
    const res = await hubDelegate({ tokenId: Number(agentTokenId as number), hubId: hub.id, needSign: hub.needSign });
  };

  return (
    <div key={hub.id}>
      <div>
        Hub Name: {hub.name}{" "}
        <Button size="small" type="primary" onClick={() => onHubDelegate(hub)}>
          Start
        </Button>
      </div>
      <div>Current Exp: {currentExp}</div>
    </div>
  );
}
