import { Select } from "antd";
import React from "react";

const config = [{}];

const handleChange = () => {};

export default function Bridge() {
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
                src="/icons/bitget-circle-logo.svg"
                width={20}
                className="rounded-[50%]"
              />
            }
            defaultValue="Bitget"
            onChange={handleChange}
            options={[]}
          />
        </div>
        <div className="p-[15px] bg-[#0f1115] mt-[27px] rounded-[5px]">
          <div className="text-[14px] text-[var(--mind-grey)] mb-[20px]">
            From
          </div>
          <Select
            prefix={
              <img
                src="/icons/bitget-circle-logo.svg"
                width={20}
                className="rounded-[50%]"
              />
            }
            defaultValue="Bitget"
            onChange={handleChange}
            options={[]}
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
                src="/icons/bitget-circle-logo.svg"
                width={20}
                className="rounded-[50%]"
              />
            }
            defaultValue="Bitget"
            onChange={handleChange}
            options={[]}
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
