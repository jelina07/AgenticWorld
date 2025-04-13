import { useRequest } from "ahooks";
import request from "../request";
import { useAccount, useSignMessage } from "wagmi";
import { isMainnet, isMainnetio } from "../utils";

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

const url = "/airdropapi/grant/claim";

// const url = isMainnet()
//   ? "https://event-api.mindnetwork.xyz/grant/claim"
//   : isMainnetio()
//   ? "https://grant-api.mindnetwork.io/grant/claim"
//   : "/grant/claim";

export default function useRelayerGetStatus(type: ActionType) {
  const { address } = useAccount();
  const result = useRequest(
    type === "claim"
      ? async () => {
          const res = await request.get(url, {
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
