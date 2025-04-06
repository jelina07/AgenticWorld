import type { MenuProps } from "antd";
import { Menu } from "antd";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useHubGetCurrent, useHubList } from "@/sdk";
import useAgentGetTokenIdStore from "@/store/useAgentGetTokenId";
import useGetLearningHubId from "@/store/useGetLearningHubId";
import { isDev, isMainnet, isMainnetio } from "@/sdk/utils";

type MenuItem = Required<MenuProps>["items"][number];

const MindMenu: React.FC = () => {
  const pathName = usePathname();
  const agentTokenId = useAgentGetTokenIdStore((state) => state.agentTokenId);
  const { data } = useHubGetCurrent({
    tokenId: agentTokenId,
  });
  const learningId = useGetLearningHubId((state) => state.learningHubId);
  const items =
    isMainnet() || isMainnetio()
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
      : isDev()
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
          {
            label: <Link href="/swap&bridge">Agent Launch</Link>,
            key: "/swap&bridge",
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
      className={`flex min-w-0 ${
        isDev() ? "min-[1301px]:min-w-[600px]" : "min-[1301px]:min-w-[510px]"
      }`}
      theme="dark"
    />
  );
};

export default MindMenu;
