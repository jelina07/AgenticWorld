import React from "react";
import Campaign from "./campaign";
import UploadHealthData from "./UploadHealthData";

export default function index({ currentSubnet }: { currentSubnet: any }) {
  return (
    <div className="mt-[60px]">
      <Campaign currentSubnet={currentSubnet} />
      <UploadHealthData />
    </div>
  );
}
