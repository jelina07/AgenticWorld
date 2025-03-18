import type { MenuProps } from "antd";
import { Menu } from "antd";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useHubGetCurrent, useHubList } from "@/sdk";
import useAgentGetTokenIdStore from "@/store/useAgentGetTokenId";
import useGetLearningHubId from "@/store/useGetLearningHubId";

type MenuItem = Required<MenuProps>["items"][number];

const MindMenu: React.FC = () => {
  const pathName = usePathname();

  const agentTokenId = useAgentGetTokenIdStore((state) => state.agentTokenId);
  const { data: subnetList } = useHubList({
    cacheKey: "useSubnetList",
    staleTime: 5 * 60 * 1000,
  });
  const { data } = useHubGetCurrent({
    tokenId: agentTokenId,
  });
  const learningId = useGetLearningHubId((state) => state.learningHubId);
  const isLearnBasicHub =
    Boolean(learningId) &&
    subnetList &&
    subnetList
      .filter((item: any) => item.type === 0)
      .map((obj: any) => obj.id)
      .includes(learningId);
  console.log("isLearnBasicHub", learningId, isLearnBasicHub);

  const items: MenuItem[] =
    learningId === undefined || isLearnBasicHub === false
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
            label: <Link href="/agenticworld">Agentic World</Link>,
            key: "/agenticworld",
          },
          {
            label: <Link href="/agentlaunch">Agent Launch</Link>,
            key: "/agentlaunch",
          },
        ]
      : [
          {
            label: <Link href="/airdrop">Airdrop</Link>,
            key: "/airdrop",
          },
          {
            label: <Link href="/">Dashboard</Link>,
            key: "/",
          },
          {
            label: <Link href="/agenticworld">Agentic World</Link>,
            key: "/agenticworld",
          },
        ];

  return (
    <Menu
      selectedKeys={[pathName]}
      mode="horizontal"
      items={items}
      // style={{ minWidth: 500 }}
      className={`flex min-w-0 min-[1201px]:min-w-[500px]`}
      theme="dark"
    />
  );
};

export default MindMenu;
