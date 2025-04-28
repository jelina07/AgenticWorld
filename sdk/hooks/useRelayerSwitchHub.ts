import { useRequest } from "ahooks";
import { Options } from "../types";
import request from "../request";
import useValidateChainWalletLink from "./useValidateChainWalletLink";
import useRelayerSignTypedData from "./useRelayerSignTypedData";
import { exceptionHandler } from "../utils/exception";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { AGENT1_ADDRESS } from "../blockChain/address";
dayjs.extend(utc);
export default function useRelayerSwitchHub(
  options?: Options<any, [number, number, boolean]>
) {
  const { validateAsync, chainId, address } = useValidateChainWalletLink();
  const { signRelayerAsync } = useRelayerSignTypedData();
  const result = useRequest(
    async (agentId, hubId, needSign = false) => {
      const isValid = await validateAsync?.();
      if (!isValid || !chainId) {
        return;
      }
      const postData = {
        user: address!,
        hubID: hubId,
        agentID: agentId,
        action: "Switch to another Hub",
        amount: BigInt(0),
      };
      const sigTs = dayjs().utc().unix();
      let delegateSig = "0x";
      if (needSign) {
        delegateSig = await request.post("/hub/verify", {
          tokenId: agentId,
          hubId,
          sigTs,
          address: AGENT1_ADDRESS[chainId],
        });
      }
      const { signature, timestamp, nonce } = await signRelayerAsync?.(
        postData
      );
      const res = (await request.post(`/relayer/agent/${chainId}/switch`, {
        user: postData.user,
        agentId: postData.agentID,
        hubId: postData.hubID,
        action: postData.action,
        signature,
        timestamp,
        nonce,
        amount: postData.amount.toString(),
        delegateSig,
        delegateSigTs: sigTs,
        chainId: chainId,
      })) as { id: number };
      return res.id;
    },
    {
      manual: true,
      onError: (err) => exceptionHandler(err),
      ...options,
    }
  );
  return result;
}
