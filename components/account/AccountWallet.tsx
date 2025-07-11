import { handleCopy, numberDigits, scan } from "@/utils/utils";
import React from "react";
import { useAccount, useDisconnect } from "wagmi";
import Copy from "@/public/icons/copy.svg";
import Mindscan from "@/public/icons/mindscan.svg";
import useGetFheBalanceStore from "@/store/useGetFheBalanceStore";
import AddFHE from "./AddFHE";

export default function AccountWallet({
  gasBalance,
  refresh,
  loading,
}: {
  refresh: Function;
  loading: boolean;
  gasBalance?: string;
}) {
  const { address, chainId } = useAccount();
  const copyAddress = (address: `0x${string}`) => {
    handleCopy(address);
  };
  const { balance } = useGetFheBalanceStore();
  const { chain } = useAccount();
  return (
    <div>
      <div className="text-[14px] font-[600] text-white mt-[20px]">
        YOUR ADDRESS
      </div>
      <div className="px-[15px] py-[19px] bg-[var(--background)] flex justify-between items-center mt-[20px]">
        <span className="text-white text-[14px] min-w-[200px]">{address}</span>
        <span onClick={() => copyAddress(address!)} className="cursor-pointer">
          <Copy />
        </span>
      </div>
      <div className="flex justify-between text-white mt-[20px]">
        <span>
          {chain?.nativeCurrency.symbol
            ? chain?.nativeCurrency.symbol + " Balance"
            : "Balance"}
        </span>
        <span>
          {gasBalance ? (gasBalance.includes("e") ? 0 : gasBalance) : 0}
        </span>
      </div>
      <div className="flex justify-between text-white mt-[10px]">
        <span>FHE Balance</span>
        <div className="flex items-center gap-[3px]">
          <span>
            {loading
              ? "loading..."
              : balance === undefined || numberDigits(balance) + " FHE"}
          </span>
          <img
            src="/icons/refresh.svg"
            alt="refresh"
            onClick={() => refresh()}
            className={`cursor-pointer ${loading ? "refresh" : ""}`}
          />
        </div>
      </div>
      <div className="flex justify-between mt-[40px]">
        <AddFHE />
        <a
          href={scan(address!, chainId!)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--mind-brand)] hover:text-[var(--mind-brand)] inline-block"
        >
          <div className="flex justify-end items-center gap-[5px]">
            <span>Scan</span>
            <Mindscan />
          </div>
        </a>
      </div>
    </div>
  );
}
