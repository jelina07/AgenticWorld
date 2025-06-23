import { getContractAddress } from "@/sdk/blockChain/address";
import { Options } from "@/sdk/types";
import { exceptionHandler } from "@/sdk/utils/exception";

import { useRequest } from "ahooks";
import { createPublicClient, erc20Abi, formatEther } from "viem";
import { readContract } from "wagmi/actions";
import { useAccount } from "wagmi";
import {
  config,
  getTransports,
  mokshaTestnet,
  vanaMainnet,
} from "@/sdk/wagimConfig";
import { isDev, isProd } from "@/sdk/utils";

const quryVanaChainId = isDev() || isProd() ? mokshaTestnet.id : vanaMainnet.id;
const publicClientVana = createPublicClient({
  batch: {
    multicall: true,
  },
  chain: isDev() || isProd() ? mokshaTestnet : vanaMainnet,
  transport: getTransports(quryVanaChainId),
});
export default function useVanaHasSend(options?: Options<any | any, []>) {
  const { address, chainId } = useAccount();
  const result = useRequest(
    async () => {
      if (!address || !chainId) {
        return;
      }
      const rewardAddress = getContractAddress(quryVanaChainId, "vanaReward");
      const amount = (await publicClientVana.readContract({
        abi: erc20Abi,
        address: rewardAddress,
        functionName: "balanceOf",
        args: [address],
      })) as bigint;
      return amount > BigInt(0);
    },
    {
      onError: (err) => exceptionHandler(err),
      refreshDeps: [chainId, address],
      ...options,
    }
  );

  return result;
}
