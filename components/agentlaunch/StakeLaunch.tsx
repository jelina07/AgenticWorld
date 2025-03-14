import { Button, Input } from "antd";
import React from "react";

export default function StakeLaunch() {
  const isAgent = false;
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
        />
        <div className="flex items-end gap-[10px]">
          <Button
            type="primary"
            className="button-brand-border"
            disabled={isAgent}
          >
            Stake
          </Button>
          <a
            href="http://"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12px] text-[var(--mind-brand)] hover:text-[var(--mind-brand)] whitespace-nowrap underline"
          >
            Buy $FHE
          </a>
        </div>
      </div>
    </div>
  );
}
