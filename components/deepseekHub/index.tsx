import React from "react";
import Chat from "./Chat";
import Framework from "./Framework";
import Chat2 from "./Chat2";

export default function DeepSeekHub({ currentSubnet }: { currentSubnet: any }) {
  return (
    <div>
      <Chat2 />
      {/* <Chat /> */}
      <Framework currentSubnet={currentSubnet} />
    </div>
  );
}
