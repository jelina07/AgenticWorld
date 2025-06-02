import React from "react";
import Campaign from "./campaign";

export default function index({ currentSubnet }: { currentSubnet: any }) {
  return (
    <div className="mt-[60px]">
      <Campaign currentSubnet={currentSubnet} />
    </div>
  );
}
