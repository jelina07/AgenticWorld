import { Select } from "antd";
import React, { useEffect, useMemo, useState } from "react";

const config = {
  ETH: {
    logo: "/icons/eth.svg",
    label: "ETH",
    value: "ETH",
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
          logo: "/icons/arbiturm.svg",
        },
      ],
    },
  },
  FHE: {
    logo: "/icons/mindtoken-icon.svg",
    label: "FHE",
    value: "FHE",
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
  const [currentToken, setCurrentToken] = useState(config["ETH"]);
  const [currentFromChain, setCurrentFromChain] = useState(
    config["ETH"].chain.from[0]
  );
  const [currentToChain, setCurrentToChain] = useState(
    config["ETH"].chain.to[0]
  );

  const fromChainOption = useMemo(() => {
    return currentToken.chain.from;
  }, [currentToken]);

  const toChainOption = useMemo(() => {
    return currentToken.chain.to.filter(
      (item: any) => item.value !== currentFromChain.value
    );
  }, [currentToken, currentFromChain]);

  const url = useMemo(() => {
    if (
      currentToken.value === "ETH" &&
      currentFromChain.value === "Arbitrum" &&
      currentToChain.value === "Mind"
    ) {
      return [
        "https://bridge.arbitrum.io/?destinationChain=mind-network&sourceChain=arbitrum-one",
        "https://app.interport.fi/bridge/42161/228/ETH/ETH",
      ];
    } else if (
      currentToken.value === "ETH" &&
      currentFromChain.value === "Mind" &&
      currentToChain.value === "Arbitrum"
    ) {
      return [
        "https://bridge.arbitrum.io/?destinationChain=arbitrum-one&sourceChain=mind-network",
      ];
    } else if (
      currentToken.value === "FHE" &&
      currentFromChain.value === "Ethereum" &&
      currentToChain.value === "Mind"
    ) {
      return [
        "https://app.transporter.io/?from=mainnet&tab=token&to=mind&token=FHE",
        "https://app.interport.fi/bridge/1/228/FHE/FHE",
      ];
    } else if (
      currentToken.value === "FHE" &&
      currentFromChain.value === "Ethereum" &&
      currentToChain.value === "BSC"
    ) {
      return [
        "https://app.transporter.io/?from=mainnet&tab=token&to=bsc&token=FHE",
        "https://app.interport.fi/bridge/1/56/FHE/FHE",
      ];
    } else if (
      currentToken.value === "FHE" &&
      currentFromChain.value === "BSC" &&
      currentToChain.value === "Mind"
    ) {
      return [
        "https://app.transporter.io/?from=bsc&tab=token&to=mind&token=FHE",
        "https://app.interport.fi/bridge/56/228/FHE/FHE",
      ];
    } else if (
      currentToken.value === "FHE" &&
      currentFromChain.value === "BSC" &&
      currentToChain.value === "Ethereum"
    ) {
      return [
        "https://app.transporter.io/?from=bsc&tab=token&to=mainnet&token=FHE",
        "https://app.interport.fi/bridge/56/1/FHE/FHE",
      ];
    } else if (
      currentToken.value === "FHE" &&
      currentFromChain.value === "Mind" &&
      currentToChain.value === "Ethereum"
    ) {
      return [
        "https://app.transporter.io/?from=mind&tab=token&to=mainnet&token=FHE",
        "https://app.interport.fi/bridge/228/1/FHE/FHE",
      ];
    } else if (
      currentToken.value === "FHE" &&
      currentFromChain.value === "Mind" &&
      currentToChain.value === "BSC"
    ) {
      return [
        "https://app.transporter.io/?from=mind&tab=token&to=bsc&token=FHE",
        "https://app.interport.fi/bridge/228/56/FHE/FHE",
      ];
    }
  }, [currentToChain]);

  useEffect(() => {
    setCurrentFromChain(fromChainOption[0]);
  }, [fromChainOption]);

  useEffect(() => {
    setCurrentToChain(toChainOption[0]);
  }, [toChainOption]);

  const changeToken = (value: string) => {
    setCurrentToken(config[value]);
  };

  const changeFromChian = (value: string) => {
    const currentFromChain = currentToken.chain.from.find(
      (item: any) => item.value === value
    );
    setCurrentFromChain(currentFromChain!);
  };

  const changeToChian = (value: string) => {
    const currentToChain = currentToken.chain.to.find(
      (item: any) => item.value === value
    );
    setCurrentToChain(currentToChain!);
  };
  const supportToken = Object.keys(config).map((str: string) => ({
    value: str,
    label: str,
  }));

  return (
    <div>
      <div className="text-[var(--mind-grey)] text-[14px] flex justify-between px-[10px]">
        <a
          href="https://docs.mindnetwork.xyz/minddocs/product/agenticworld/bridge"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[14px] text-[var(--mind-brand)] hover:text-[var(--mind-brand)] underline hover:underline"
        >
          User Guide
        </a>
        ETH serves as the gas token for MindChain.
      </div>
      <div className="p-[30px] bg-[#181818] mt-[10px] rounded-[20px] mind-select pb-[50px]">
        <div className="flex gap-[30px] items-center">
          <div className="text-white font-[600]">Select Token:</div>
          <Select
            prefix={
              <img
                src={currentToken.logo}
                width={20}
                className="rounded-[50%]"
              />
            }
            defaultValue="ETH"
            onChange={changeToken}
            options={supportToken}
            style={{ width: "auto", minWidth: 120 }}
            dropdownStyle={{
              minWidth: "fit-content",
              maxWidth: 300,
              whiteSpace: "nowrap",
            }}
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
            defaultValue="Arbitrum"
            value={currentFromChain.value}
            onChange={changeFromChian}
            options={fromChainOption}
            style={{ width: "auto", minWidth: 120 }}
            dropdownStyle={{
              minWidth: "fit-content",
              maxWidth: 300,
              whiteSpace: "nowrap",
            }}
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
            defaultValue="MindChain"
            value={currentToChain.value}
            onChange={changeToChian}
            options={toChainOption}
            style={{ width: "auto", minWidth: 120 }}
            dropdownStyle={{
              minWidth: "fit-content",
              maxWidth: 300,
              whiteSpace: "nowrap",
            }}
          />
        </div>
        <div className="mt-[40px] flex gap-[10px]">
          {url?.map((item: string) => (
            <a
              href={item}
              target="_blank"
              rel="noopener noreferrer"
              id="mind-bridge"
              key={item}
            >
              {item.includes("transporter")
                ? "Bridge via Transporter"
                : item.includes("interport")
                ? "Bridge via Interport"
                : "Bridge via Arbitrum"}
            </a>
          ))}
        </div>
        {currentToken.value === "FHE" ? (
          <div className="text-[14px] font-[600] text-right text-white mt-[10px]">
            Bridge is powered by CCIP
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
