import { useRequest } from "ahooks";
import { Options } from "../types";
import request from "../request";
import useValidateChainWalletLink from "./useValidateChainWalletLink";
import useRelayerSignTypedData from "./useRelayerSignTypedData";
import { exceptionHandler } from "../utils/exception";

export default function useRelayerExitCurrentHub(options?: Options<any, [number]>) {
  const { validateAsync, chainId, address } = useValidateChainWalletLink();

  const { signRelayerAsync } = useRelayerSignTypedData();

  const result = useRequest(
    async (agentId) => {
      const isValid = await validateAsync?.();
      if (!isValid || !chainId) {
        return;
      }

      const postData = {
        user: address!,
        hubID: 0,
        agentID: agentId,
        action: "Exit current Hub",
        amount: BigInt(0),
      };

      const { signature, timestamp, nonce } = await signRelayerAsync?.(postData);

      const res = (await request.post(`/relayer/agent/${chainId}/undelegate`, {
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
