import { useRequest } from "ahooks";
import request from "../request";

// 支持的操作类型
const ACTIONS = ["stake", "unstake", "delegate", "undelegate", "switch", "burn", "claim"] as const;
type ActionType = (typeof ACTIONS)[number];

export default function useRelayerGetStatus(type: ActionType) {
  const result = useRequest(
    async (chainId: number, id: number) => {
      const res = await request.get(`/relayer/agent/${chainId}/${type}/status`, { params: { id } });
      return res;
    },
    {
      manual: true,
      pollingInterval: 1000, //每秒执行一次
    }
  );
  return result;
}
