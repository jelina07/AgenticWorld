import React from "react";
import Chat from "./Chat";
import Framework from "./Framework";

export default function DeepSeekHub({ currentSubnet }: { currentSubnet: any }) {
  return (
    <div>
      <Chat />
      <Framework currentSubnet={currentSubnet} />
    </div>
  );
}
