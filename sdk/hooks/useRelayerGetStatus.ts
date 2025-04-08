import { useRequest } from "ahooks";
import request from "../request";
import { useAccount, useSignMessage } from "wagmi";

//
const ACTIONS = [
  "stake",
  "unstake",
  "delegate",
  "undelegate",
  "switch",
  "burn",
  "claim",
] as const;
type ActionType = (typeof ACTIONS)[number];

export default function useRelayerGetStatus(type: ActionType) {
  const { address } = useAccount();
  const result = useRequest(
    type === "claim"
      ? async () => {
          const res = await request.get(`/grant/claim`, {
            params: { wallet: address },
          });
          return res;
        }
      : async (chainId: number, id: number) => {
          const res = await request.get(
            `/relayer/agent/${chainId}/${type}/status`,
            { params: { id } }
          );
          return res;
        },
    {
      manual: true,
      pollingInterval: 3000,
      ready: type === "claim" ? !!address : true,
    }
  ) as any;
  return result;
}
