import { useRequest } from "ahooks";
import { Options } from "../types";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import request from "../request";
import { AGENT1_ADDRESS } from "../blockChain/address";
import useValidateChainWalletLink from "./useValidateChainWalletLink";
import { isDev } from "../utils";
import { config, mindnet, mindtestnet } from "../wagimConfig";
import { useWriteContract } from "wagmi";
import { AGENT1_ABI } from "../blockChain/abi";
import { waitForTransactionReceipt } from "wagmi/actions";

dayjs.extend(utc);

type DelegatePayload = {
  tokenId: number;
  hubId: number;
  needSign: boolean;
};

export default function useHubDelegate(options?: Options<unknown, [DelegatePayload]> & { waitForReceipt?: boolean }) {
  const { validateAsync } = useValidateChainWalletLink(isDev() ? mindtestnet.id : mindnet.id);
  const { writeContractAsync } = useWriteContract();

  const result = useRequest(
    async (payload) => {
      const isValid = await validateAsync?.();
      if (!isValid) {
        return;
      }
      const sigTs = dayjs().utc().unix();
      let signature = "0x";
      if (payload.needSign) {
        signature = await request.post("/hub/verify", { ...payload, sigTs, address: AGENT1_ADDRESS.address });
      }
      const txHash = await writeContractAsync({
        abi: AGENT1_ABI,
        functionName: "delegate",
        address: AGENT1_ADDRESS.address,
        args: [payload.tokenId, payload.hubId, signature, sigTs],
      });
      if (!options?.waitForReceipt) {
        return txHash;
      }
      const receipt = await waitForTransactionReceipt(config, { hash: txHash });
      return receipt;
    },
    {
      manual: true,
      ...options,
    }
  );

  return result;
}
