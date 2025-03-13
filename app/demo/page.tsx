"use client";

import { useAirdropCheck, useAirdropClaim, useAirdropRelayerClaim } from "@/sdk";
import { Button, Card, Flex, Input } from "antd";
import { useState } from "react";

export default function DemoPage() {
  const [checkWallet, setCheckWallet] = useState("");
  const { runAsync } = useAirdropCheck();
  const [checkRes, setCheckRes] = useState<unknown>();

  const { runAsync: relayerClaim } = useAirdropRelayerClaim();
  const { runAsync: claim } = useAirdropClaim({ waitForReceipt: true });
  const [relayerClaimRes, setRelayerClaimRes] = useState<unknown>();

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

      <Card title="Agent Lanuch" className="!mt-6"></Card>
    </div>
  );
}
