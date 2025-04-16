import type { MenuProps } from "antd";
import { Menu } from "antd";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useHubGetCurrent, useHubList } from "@/sdk";
import useAgentGetTokenIdStore from "@/store/useAgentGetTokenId";
import useGetLearningHubId from "@/store/useGetLearningHubId";
import { isDev, isMainnet, isMainnetio, isProd } from "@/sdk/utils";

type MenuItem = Required<MenuProps>["items"][number];

const MindMenu: React.FC = () => {
  const pathName = usePathname();
  const agentTokenId = useAgentGetTokenIdStore((state) => state.agentTokenId);
  const { data } = useHubGetCurrent({
    tokenId: agentTokenId,
  });

  const items =
    isDev() || isMainnetio() || isMainnet()
      ? [
          {
            label: (
              <Link
                href="/airdrop"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = "/airdrop";
                }}
              >
                Airdrop
              </Link>
            ),
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
            label: <Link href="/bridge">Bridge</Link>,
            key: "/bridge",
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
        isProd() ? "min-[1301px]:min-w-[510px]" : "min-[1301px]:min-w-[550px]"
      }`}
      theme="dark"
    />
  );
};

export default MindMenu;
