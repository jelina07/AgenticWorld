import React from "react";
import Campaign from "./campaign";
import UploadHealthData from "./UploadHealthData";
import { useAccount } from "wagmi";
import { mindnet, mindtestnet } from "@/sdk/wagimConfig";

export default function index() {
  const { chainId } = useAccount();
  return (
    <div className="mt-[60px]">
      <Campaign />
      {chainId === mindnet.id || chainId === mindtestnet.id ? (
        <></>
      ) : (
        <UploadHealthData />
      )}
    </div>
  );
}
