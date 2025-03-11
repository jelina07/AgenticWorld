"use client";
import React, { useState } from "react";
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
  {
    label: <Link href="/airdrop">Airdrop</Link>,
    key: "airdrop",
  },
  {
    label: <Link href="/">Dashboard</Link>,
    key: "dashboard",
  },
  {
    label: <Link href="/agenticworld">Agentic World</Link>,
    key: "agenticworld",
  },
  {
    label: <Link href="/agentlaunch">Agent Launch</Link>,
    key: "agentlaunch",
  },
];

const MindMenu: React.FC = () => {
  const [current, setCurrent] = useState("dashboard");
  const pathName = usePathname();
  const router = useRouter();

  const onClick: MenuProps["onClick"] = (e) => {
    setCurrent(e.key);
  };

  return (
    <Menu
      onClick={onClick}
      selectedKeys={[current]}
      mode="horizontal"
      items={items}
      // style={{ minWidth: 500 }}
      className={`flex min-w-0 min-[1201px]:min-w-[500px]`}
      theme="dark"
    />
  );
};

export default MindMenu;
