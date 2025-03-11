"use client";
import React, { useEffect } from "react";
import MindLogo from "../mindLogo/MindLogo";
import { WalletConnectBtn } from "./WalletConnectBtn";
import MindMenu from "../menu/MindMenu";

function changeToImage() {
  const ellipsis = document.querySelector(".mind-menu .anticon-ellipsis");
  if (ellipsis) {
    ellipsis.innerHTML = '<img src="/icons/menu.svg" alt="menu" />';
  }
}

export default function Index() {
  useEffect(() => {
    changeToImage();
  }, []);

  return (
    <div className="py-[15px] flex justify-between">
      <MindLogo />
      <div className="flex gap-[10px] items-center mind-menu">
        <MindMenu />
        <WalletConnectBtn />
      </div>
    </div>
  );
}
