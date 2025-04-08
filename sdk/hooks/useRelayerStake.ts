import { useRequest } from "ahooks";
import { Options } from "../types";
import request from "../request";
import useValidateChainWalletLink from "./useValidateChainWalletLink";
import { estimateGasUtil } from "../utils/script";
import { DAOTOKEN_ABI } from "../blockChain/abi";
import { AGENT1_ADDRESS, DAOKEN_ADDRESS } from "../blockChain/address";
import { parseEther } from "viem";
import useRelayerSignTypedData from "./useRelayerSignTypedData";
import { exceptionHandler } from "../utils/exception";

export default function useRelayerStake(
  options?: Options<any, [number, string]>
) {
  const { validateAsync, chainId, address } = useValidateChainWalletLink();

  const { signRelayerAsync, signPermitAsync } = useRelayerSignTypedData();

  const result = useRequest(
    async (agentId, amount) => {
      const isValid = await validateAsync?.();
      if (!isValid || !chainId) {
        return;
      }

      const {
        signature: permitSignature,
        spender: permitSpender,
        deadline: permitDeadline,
      } = await signPermitAsync({
        spender: AGENT1_ADDRESS[chainId],
        assetAmount: parseEther(amount),
      });

      const postData = {
        user: address!,
        hubID: 0,
        agentID: agentId,
        action: "Stake FHE",
        amount: parseEther(amount),
      };

      const { signature, timestamp, nonce } = await signRelayerAsync?.(
        postData
      );

      const res = (await request.post(`/relayer/agent/${chainId}/stake`, {
        user: postData.user,
        agentId: postData.agentID,
        hubId: postData.hubID,
        action: postData.action,
        signature,
        timestamp,
        nonce,
        amount: postData.amount.toString(),
        permitSignature,
        permitSpender,
        permitDeadline,
      })) as { id: number };
      return res.id;
    },
    {
      manual: true,
      onError: (err) => exceptionHandler(err, "relayerStake"),
      ...options,
    }
  );

  return result;
}
