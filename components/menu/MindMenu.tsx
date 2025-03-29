import type { MenuProps } from "antd";
import { Menu } from "antd";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useHubGetCurrent, useHubList } from "@/sdk";
import useAgentGetTokenIdStore from "@/store/useAgentGetTokenId";
import useGetLearningHubId from "@/store/useGetLearningHubId";
import { useMemo } from "react";
import { isDev, isProd } from "@/sdk/utils";

type MenuItem = Required<MenuProps>["items"][number];

const MindMenu: React.FC = () => {
  const pathName = usePathname();
  const agentTokenId = useAgentGetTokenIdStore((state) => state.agentTokenId);
  const { data } = useHubGetCurrent({
    tokenId: agentTokenId,
  });
  const learningId = useGetLearningHubId((state) => state.learningHubId);
  const items = isDev()
    ? [
        {
          label: <Link href="/airdrop">Airdrop</Link>,
          key: "/airdrop",
        },
        {
          label: <Link href="/">Dashboard</Link>,
          key: "/",
        },
        {
          label: <Link href="/agenticworld">AgenticWorld</Link>,
          key: "/agenticworld",
        },
        {
          label: <Link href="/agentlaunch">Agent Launch</Link>,
          key: "/agentlaunch",
        },
      ]
    : [
        {
          label: <Link href="/">Dashboard</Link>,
          key: "/",
        },
        {
          label: <Link href="/agenticworld">AgenticWorld</Link>,
          key: "/agenticworld",
        },
        {
          label: <Link href="/agentlaunch">Agent Launch</Link>,
          key: "/agentlaunch",
        },
      ];

  return (
    <Menu
      selectedKeys={[pathName]}
      mode="horizontal"
      items={items}
      className={`flex min-w-0 min-[1201px]:min-w-[430px]`}
      theme="dark"
    />
  );
};

export default MindMenu;
