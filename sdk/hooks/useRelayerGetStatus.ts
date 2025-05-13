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
  "rewardsClaim",
] as const;
type ActionType = (typeof ACTIONS)[number];

type CampaignType = "early-bird";

export default function useRelayerGetStatus(
  type: ActionType,
  airdropCampaignType?: CampaignType
) {
  const { address } = useAccount();
  const url = isMainnet()
    ? airdropCampaignType === "early-bird"
      ? "https://agent.mindnetwork.xyz/airdropapi/grant/early_bird/claim"
      : "https://agent.mindnetwork.xyz/airdropapi/grant/claim"
    : isMainnetio()
    ? airdropCampaignType === "early-bird"
      ? "https://agent.mindnetwork.io/airdropapi/grant/early_bird/claim"
      : "https://agent.mindnetwork.io/airdropapi/grant/claim"
    : airdropCampaignType === "early-bird"
    ? "/grant/early_bird/claim"
    : "/grant/claim";

  const result = useRequest(
    //airdrop
    type === "claim"
      ? async () => {
          const res = await request.get(url, {
            params: { wallet: address },
          });
          return res;
        }
      : //else
        async (chainId: number, id: number) => {
          if (type === "rewardsClaim") {
            const res = await request.get(
              `/relayer/agent/${chainId}/claim/status`,
              { params: { id } }
            );
            return res;
          } else {
            const res = await request.get(
              `/relayer/agent/${chainId}/${type}/status`,
              { params: { id } }
            );
            return res;
          }
        },
    {
      manual: true,
      pollingInterval: 3000,
      ready: type === "claim" ? !!address : true,
    }
  ) as any;
  return result;
}
