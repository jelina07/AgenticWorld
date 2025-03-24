import { useRequest } from "ahooks";
import { Options } from "../types";
import { config } from "../wagimConfig";
import { exceptionHandler } from "../utils/exception";
import { getBalance } from "@wagmi/core";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import useGetFheBalanceStore from "@/store/useGetFheBalanceStore";
import { DAOKEN_ADDRESS } from "../blockChain/address";

export default function useGetFheBalance(options?: Options<any, []>) {
  const { address, chainId } = useAccount();
  const { setBalance } = useGetFheBalanceStore();
  const result = useRequest(
    async () => {
      if (!address || !chainId) {
        setBalance("");
        return;
      }

      const balance = await getBalance(config, {
        address,
        token: DAOKEN_ADDRESS[chainId],
      });
      setBalance(balance.formatted);
      console.log("useGetFheBalance", balance);
      return balance.formatted;
    },
    {
      onError: (err) => exceptionHandler(err),
      refreshDeps: [address, chainId],
      ...options,
    }
  );

  return result;
}
