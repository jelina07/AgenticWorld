import { useRequest } from "ahooks";
import { Options } from "../types";
import { useAccount } from "wagmi";
import { exceptionHandler } from "../utils/exception";
import { readContract } from "wagmi/actions";
import {
  bnb,
  bnbtestnet,
  config,
  getTransports,
  mindnet,
  mindtestnet,
} from "../wagimConfig";
import { AIRDROP_ABI } from "../blockChain/abi";

import { isSupportChain } from "../utils/script";
import { createPublicClient } from "viem";
import { isDev, isProd } from "../utils";
import { useLov } from "@/store/useLov";

const publicClientBsc = createPublicClient({
  batch: {
    multicall: true,
  },
  chain: isDev() || isProd() ? bnbtestnet : bnb,
  transport:
    isDev() || isProd() ? getTransports(bnbtestnet.id) : getTransports(bnb.id),
});

export default function useBnbAirdropIsClaimed(options?: Options<any, any>) {
  const { address, chainId } = useAccount();
  const isBnbChain = isDev() || isProd() ? bnbtestnet.id : bnb.id;
  const { getContractAdress } = useLov();

  const result = useRequest(
    async () => {
      const airdropAddressArray = getContractAdress();
      const airdropAirdropBnbLaunchContractAddress = airdropAddressArray.find(
        (item) => item.key === "airdrop_bnb_launch"
      )?.value;

      if (
        !address ||
        !chainId ||
        !isBnbChain ||
        !airdropAirdropBnbLaunchContractAddress
      ) {
        return;
      }
      const res = (await publicClientBsc.readContract({
        abi: AIRDROP_ABI,
        address: airdropAirdropBnbLaunchContractAddress,
        functionName: "claimed",
        args: [address],
      })) as boolean;

      return res;
    },
    {
      onError: (err) => exceptionHandler(err),
      refreshDeps: [address, chainId],
      manual: true,
      ...options,
    }
  );

  return result;
}
