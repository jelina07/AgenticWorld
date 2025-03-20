import { useRequest } from "ahooks";
import { Options } from "../types";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import request from "../request";
import { AGENT1_ADDRESS } from "../blockChain/address";
import useValidateChainWalletLink from "./useValidateChainWalletLink";
import { isDev, isProd } from "../utils";
import { config, mindnet, mindtestnet } from "../wagimConfig";
import { useWriteContract } from "wagmi";
import { AGENT1_ABI } from "../blockChain/abi";
import { waitForTransactionReceipt } from "wagmi/actions";
import { exceptionHandler } from "../utils/exception";
import { estimateGasUtil } from "../utils/script";

dayjs.extend(utc);

type DelegatePayload = {
  tokenId: number;
  hubId: number;
  needSign: boolean;
};

export default function useHubDelegate(options?: Options<any, [DelegatePayload]> & { waitForReceipt?: boolean }) {
  const { validateAsync, chainId } = useValidateChainWalletLink();
  const { writeContractAsync } = useWriteContract();

  const result = useRequest(
    async (payload) => {
      const isValid = await validateAsync?.();
      if (!isValid || !chainId) {
        return;
      }
      const sigTs = dayjs().utc().unix();
      let signature = "0x";
      if (payload.needSign) {
        signature = await request.post("/hub/verify", {
          ...payload,
          sigTs,
          address: AGENT1_ADDRESS[chainId],
        });
      }
      const gasEstimate = await estimateGasUtil(
        AGENT1_ABI,
        "delegate",
        [payload.tokenId, payload.hubId, signature, sigTs],
        AGENT1_ADDRESS[chainId!]
      );
      const txHash = await writeContractAsync({
        abi: AGENT1_ABI,
        functionName: "delegate",
        address: AGENT1_ADDRESS[chainId],
        args: [payload.tokenId, payload.hubId, signature, sigTs],
        gas: gasEstimate + gasEstimate / BigInt(3),
      });
      if (!options?.waitForReceipt) {
        return txHash;
      }
      const receipt = await waitForTransactionReceipt(config, { hash: txHash });
      return receipt;
    },
    {
      onError: (err) => exceptionHandler(err),
      manual: true,
      ...options,
    }
  );

  return result;
}
