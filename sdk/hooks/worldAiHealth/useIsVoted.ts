import { useRequest } from "ahooks";
import { Options } from "../../types";
import { isDev, isMainnet, isMainnetio, isProd } from "@/sdk/utils";
import request from "@/sdk/request";
import useValidateChainWalletLink from "../useValidateChainWalletLink";
import { bnb, bnbtestnet, getTransports } from "@/sdk/wagimConfig";
import { createPublicClient } from "viem";
import { WORLDAIHEALTHY_ABI } from "@/sdk/blockChain/abi";
import { WORLAIHEALTHY_HUB_ADDRESS } from "@/sdk/blockChain/address";
import { useAccount } from "wagmi";

const publicClientBSC = createPublicClient({
  batch: {
    multicall: true,
  },
  chain: isDev() || isProd() ? bnbtestnet : bnb,
  transport:
    isDev() || isProd() ? getTransports(bnbtestnet.id) : getTransports(bnb.id),
});

const quryBSCChainId = isDev() || isProd() ? bnbtestnet.id : bnb.id;

export default function useIsVoted(options?: Options<any, any>) {
  const { address, chain } = useAccount();
  const result = useRequest(
    async () => {
      if (!address || !chain) {
        return;
      }
      const res = (await publicClientBSC.readContract({
        abi: WORLDAIHEALTHY_ABI,
        address: WORLAIHEALTHY_HUB_ADDRESS[quryBSCChainId],
        functionName: "lastVoted",
        args: [address],
      })) as bigint;
      console.log("res,res", res);

      return res > BigInt(0);
    },
    {
      refreshDeps: [address],
      ...options,
    }
  );

  return result;
}
