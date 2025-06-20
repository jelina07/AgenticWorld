import { getContractAddress } from "@/sdk/blockChain/address";
import { Options } from "@/sdk/types";
import { exceptionHandler } from "@/sdk/utils/exception";

import { useRequest } from "ahooks";
import { erc20Abi, formatEther } from "viem";
import { readContract } from "wagmi/actions";
import { useAccount } from "wagmi";
import { config, mokshaTestnet, vanaMainnet } from "@/sdk/wagimConfig";

export default function useVanaHasSend(options?: Options<any | any, []>) {
  const { address, chainId } = useAccount();
  const result = useRequest(
    async () => {
      if (
        !address ||
        !chainId ||
        (chainId !== vanaMainnet.id && chainId !== mokshaTestnet.id)
      ) {
        return;
      }
      const rewardAddress = getContractAddress(chainId, "vanaReward");
      const amount = (await readContract(config, {
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
