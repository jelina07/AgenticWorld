import { Select } from "antd";
import React, { useState } from "react";

const config = {
  EHT: {
    logo: "/icons/eth.svg",
    chain: {
      from: [
        {
          label: "Arbitrum",
          value: "Arbitrum",
          logo: "/icons/arbiturm.svg",
        },
        {
          label: "MindChain",
          value: "Mind",
          logo: "/icons/mind-chain.svg",
        },
      ],
      to: [
        {
          label: "MindChain",
          value: "Mind",
          logo: "/icons/mind-chain.svg",
        },
        {
          label: "Arbitrum",
          value: "Arbitrum",
          logo: "",
        },
      ],
    },
  },
  FHE: {
    logo: "/icons/mindtoken-icon.svg",
    chain: {
      from: [
        {
          label: "Ethereum",
          value: "Ethereum",
          logo: "/icons/eth.svg",
        },
        {
          label: "BSC",
          value: "BSC",
          logo: "/images/bnb.png",
        },
        {
          label: "MindChain",
          value: "Mind",
          logo: "/icons/mind-chain.svg",
        },
      ],
      to: [
        {
          label: "Ethereum",
          value: "Ethereum",
          logo: "/icons/eth.svg",
        },
        {
          label: "BSC",
          value: "BSC",
          logo: "/images/bnb.png",
        },
        {
          label: "MindChain",
          value: "Mind",
          logo: "/icons/mind-chain.svg",
        },
      ],
    },
  },
} as any;

export default function Bridge() {
  const [currentConfig, setCurrentConfig] = useState({
    logo: "/icons/eth.svg",
    chain: {
      from: [
        {
          label: "Arbitrum",
          value: "Arbitrum",
          logo: "/icons/arbiturm.svg",
        },
        {
          label: "Mind",
          value: "Mind",
          logo: "/icons/mind-chain.svg",
        },
      ],
      to: [
        {
          label: "Mind",
          value: "Mind",
          logo: "/icons/mind-chain.svg",
        },
        {
          label: "Arbitrum",
          value: "Arbitrum",
          logo: "",
        },
      ],
    },
  });
  const [currentFromChain, setCurrentFromChain] = useState({
    label: "Arbitrum",
    value: "Arbitrum",
    logo: "/icons/arbiturm.svg",
  });
  const [currentToChain, setCurrentToChain] = useState({
    label: "MindChain",
    value: "Mind",
    logo: "/icons/mind-chain.svg",
  });

  const handleChange = (value: string) => {
    const currentConfig = config[value];
    console.log("currentConfig", currentConfig);
    setCurrentConfig(currentConfig);
    setCurrentFromChain(currentConfig.chain.from[0]);
    setCurrentToChain(currentConfig.chain.to[0]);
  };

  const supportToken = Object.keys(config).map((str: string) => ({
    value: str,
    label: str,
  }));

  return (
    <div>
      <div className="text-[var(--mind-grey)] text-[14px] text-right">
        ETH serves as the gas token for MindChain.
      </div>
      <div className="p-[15px] bg-[#181818] mt-[10px] rounded-[20px] mind-select">
        <div className="flex gap-[30px] items-center">
          <div className="text-white font-[600]">Select Token:</div>
          <Select
            prefix={
              <img
                src={currentConfig.logo}
                width={20}
                className="rounded-[50%]"
              />
            }
            defaultValue="ETH"
            onChange={handleChange}
            options={supportToken}
          />
        </div>
        <div className="p-[15px] bg-[#0f1115] mt-[27px] rounded-[5px]">
          <div className="text-[14px] text-[var(--mind-grey)] mb-[20px]">
            From
          </div>
          <Select
            prefix={
              <img
                src={currentFromChain.logo}
                width={20}
                className="rounded-[50%]"
              />
            }
            defaultValue={currentFromChain.value}
            options={currentConfig.chain.from}
          />
        </div>
        <div className="my-[20px]">
          <img
            src="/icons/swap-icon.svg"
            alt="swap-icon"
            width={35}
            className="mx-auto"
          />
        </div>
        <div className="p-[15px] bg-[#0f1115] mt-[27px] rounded-[5px]">
          <div className="text-[14px] text-[var(--mind-grey)] mb-[20px]">
            To
          </div>
          <Select
            prefix={
              <img
                src={currentToChain.logo}
                width={20}
                className="rounded-[50%]"
              />
            }
            defaultValue={currentToChain.value}
            options={currentConfig.chain.to}
          />
        </div>
        <div className="mt-[40px]">
          <a
            href="http://"
            target="_blank"
            rel="noopener noreferrer"
            id="mind-bridge"
          >
            Go
          </a>
        </div>
      </div>
    </div>
  );
}
