import { useRequest } from "ahooks";
import { Options } from "../../types";
import { waitForTransactionReceipt, writeContract } from "wagmi/actions";
import { bnb, bnbtestnet, config } from "../../wagimConfig";
import { WORLAIHEALTHY_HUB_ADDRESS } from "../../blockChain/address";
import { exceptionHandler } from "../../utils/exception";
import { WORLDAIHEALTHY_ABI } from "@/sdk/blockChain/abi";
import useValidateChainWalletLink from "../useValidateChainWalletLink";
import { isDev, isMainnet, isMainnetio, isProd } from "@/sdk/utils";
import { estimateGasUtil } from "@/sdk/utils/script";
import axios from "axios";
import request from "@/sdk/request";

// const url = isMainnet()
//   ? "https://agent.mindnetwork.xyz/api/health-hub/sign-message"
//   : isMainnetio()
//   ? "https://agent.mindnetwork.io/api/health-hub/sign-message"
//   : `${process.env.NEXT_PUBLIC_API_URL}/health-hub/sign-message`;

const url = isMainnet()
  ? "https://agent.mindnetwork.xyz/api/health-hub/sign-message"
  : isMainnetio()
  ? "https://agent.mindnetwork.io/api/health-hub/sign-message"
  : `/health-hub/sign-message`;

export default function useSendTxn(
  options?: Options<any, any>,
  waitForReceipt = true
) {
  const targetChain: any = isDev() || isProd() ? bnbtestnet.id : bnb.id;
  const { validateAsync, chainId, address } =
    useValidateChainWalletLink(targetChain);

  const result = useRequest(
    async () => {
      const isValid = await validateAsync?.();
      if (!isValid || !chainId) {
        return;
      }

      // get signature
      const resSignature = await request.post(url, {
        walletAddress: address,
        contractAddress: WORLAIHEALTHY_HUB_ADDRESS[chainId],
      });

      // send hash to chain: bsc
      const gasEstimate = await estimateGasUtil(
        WORLDAIHEALTHY_ABI,
        "vote",
        [
          resSignature.data.data.fileHash,
          resSignature.data.data.signature,
          resSignature.data.data.sigTs,
        ],
        WORLAIHEALTHY_HUB_ADDRESS[chainId]
      );
      const txHash = await writeContract(config, {
        abi: WORLDAIHEALTHY_ABI,
        address: WORLAIHEALTHY_HUB_ADDRESS[chainId],
        functionName: "vote",
        args: [
          resSignature.data.data.fileHash,
          resSignature.data.data.signature,
          resSignature.data.data.sigTs,
        ],
        gas: gasEstimate! + gasEstimate! / BigInt(3),
        chainId: targetChain,
      });
      console.log("txHash", txHash);

      if (!waitForReceipt) {
        return txHash;
      }
      const receipt = await waitForTransactionReceipt(config, {
        hash: txHash,
      });
      return receipt;
    },
    {
      manual: true,
      onError: (err) =>
        exceptionHandler(err, "worldAIHealth", WORLDAIHEALTHY_ABI),
      ...options,
    }
  );
  return result;
}
