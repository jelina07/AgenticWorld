import { useRequest } from "ahooks";
import { Options } from "../types";
import request from "../request";
import useValidateChainWalletLink from "./useValidateChainWalletLink";
import useRelayerSignTypedData from "./useRelayerSignTypedData";
import { exceptionHandler } from "../utils/exception";

export default function useRelayerClaimReward(options?: Options<any, []>) {
  const { validateAsync, chainId, address } = useValidateChainWalletLink();

  const { signRelayerAsync } = useRelayerSignTypedData();

  const result = useRequest(
    async () => {
      const isValid = await validateAsync?.();
      if (!isValid || !chainId) {
        return;
      }

      const postData = {
        user: address!,
        hubID: 0,
        agentID: 0,
        action: "claim reward",
        amount: BigInt(0),
      };

      const { signature, timestamp, nonce } = await signRelayerAsync?.(postData);

      const res = (await request.post(`/relayer/agent/${chainId}/claim`, {
        user: postData.user,
        agentId: postData.agentID,
        hubId: postData.hubID,
        action: postData.action,
        signature,
        timestamp,
        nonce,
        amount: postData.amount.toString(),
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
