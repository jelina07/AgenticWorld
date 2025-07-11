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

const publicClientMind = createPublicClient({
  batch: {
    multicall: true,
  },
  chain: isDev() || isProd() ? mindtestnet : mindnet,
  transport:
    isDev() || isProd()
      ? getTransports(mindtestnet.id)
      : getTransports(mindnet.id),
});
const publicClientBsc = createPublicClient({
  batch: {
    multicall: true,
  },
  chain: isDev() || isProd() ? bnbtestnet : bnb,
  transport:
    isDev() || isProd() ? getTransports(bnbtestnet.id) : getTransports(bnb.id),
});

export default function useAirdropIsClaimed(options?: Options<any, any>) {
  const { address, chainId } = useAccount();
  const { getContractAdress } = useLov();

  const result = useRequest(
    async (claimChain) => {
      const airdropAddressArray = getContractAdress();
      const airdropContractAddressHaveNull = airdropAddressArray.some(
        (item) => item.value === null
      );
      if (
        !address ||
        !chainId ||
        !isSupportChain(chainId) ||
        airdropContractAddressHaveNull
      ) {
        return;
      }
      const publicClient =
        claimChain === "MindChain" ? publicClientMind : publicClientBsc;

      const contractAddressChainId =
        claimChain === "MindChain"
          ? isDev() || isProd()
            ? mindtestnet.id
            : mindnet.id
          : isDev() || isProd()
          ? bnbtestnet.id
          : bnb.id;

      const AIRDROP_ADDRESSByService =
        contractAddressChainId === bnbtestnet.id ||
        contractAddressChainId === bnb.id
          ? airdropAddressArray.find((item) => item.key === "airdrop_bsc")
              ?.value
          : contractAddressChainId === mindtestnet.id ||
            contractAddressChainId === mindnet.id
          ? airdropAddressArray.find((item) => item.key === "airdrop_mind")
              ?.value
          : "0x";

      const res = (await publicClient.readContract({
        abi: AIRDROP_ABI,
        address: AIRDROP_ADDRESSByService,
        functionName: "claimed",
        args: [address],
      })) as boolean;

      console.log("res", res);

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
