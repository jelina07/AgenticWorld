import { handleCopy, mindscan } from "@/utils/utils";
import React from "react";
import { useAccount, useDisconnect } from "wagmi";
import Copy from "@/public/icons/copy.svg";
import Mindscan from "@/public/icons/mindscan.svg";

export default function AccountWallet({ gasBalance }: { gasBalance?: string }) {
  const { address } = useAccount();
  const copyAddress = (address: `0x${string}`) => {
    handleCopy(address);
  };
  return (
    <div>
      <div className="text-[14px] font-[600] text-white">YOUR ADDRESS</div>
      <div className="px-[15px] py-[19px] bg-[var(--background)] flex justify-between items-center mt-[20px]">
        <span className="text-white text-[14px] min-w-[200px]">{address}</span>
        <span onClick={() => copyAddress(address!)} className="cursor-pointer">
          <Copy />
        </span>
      </div>
      <div className="flex justify-between text-white mt-[20px]">
        <span>ETH Balance</span>
        <span>{gasBalance ? gasBalance : 0}</span>
      </div>
      <div className="flex justify-between text-white mt-[10px]">
        <span>FHE Balance</span>
        <span>100</span>
      </div>
      <div className="text-right mt-[40px]">
        <a
          href={mindscan(address!)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--mind-brand)] hover:text-[var(--mind-brand)] inline-block"
        >
          <div className="flex justify-end items-center gap-[5px]">
            <span>MindScan</span>
            <Mindscan />
          </div>
        </a>
      </div>
    </div>
  );
}
