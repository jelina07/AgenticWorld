import React from "react";
import MindLogo from "../mindLogo/MindLogo";
import MindSocial from "./MindSocial";
import MindLink from "./MindLink";
import { Divider } from "antd";

export default function Index() {
  return (
    <footer className="h-[80px] w-full bg-[#080F0F] py-[10px] px-[var(--layout-sm)] md:px-[var(--layout-md)] lg:px-[var(--header-layout-lg)]">
      <div className="sm:flex justify-between items-center gap-[10px]">
        <div className="flex items-center">
          <MindLogo />
          <Divider
            type="vertical"
            style={{ borderColor: "#fff", height: "30px", margin: "0 30px" }}
          />
          <MindSocial />
        </div>
        <MindLink />
      </div>
    </footer>
  );
}
