import React from "react";
import Chat from "./Chat";
import Framework from "./Framework";
import Chat2 from "./Chat2";
import Chat4 from "./Chat4";

export default function DeepSeekHub({ currentSubnet }: { currentSubnet: any }) {
  return (
    <div>
      <Chat4 />
      <Framework currentSubnet={currentSubnet} />
    </div>
  );
}
