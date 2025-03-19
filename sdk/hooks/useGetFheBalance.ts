import { useRequest } from "ahooks";
import { Options } from "../types";
import { config } from "../wagimConfig";
import { DAOKEN_ADDRESS_CONFIG } from "../blockChain/address";
import { exceptionHandler } from "../utils/exception";
import { getBalance } from "@wagmi/core";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import useGetFheBalanceStore from "@/store/useGetFheBalance";
import { isDev, isProd } from "../utils";

export default function useGetFheBalance(options?: Options<any, []>) {
  const { address } = useAccount();
  const { setBalance } = useGetFheBalanceStore();
  const result = useRequest(
    async () => {
      if (!address) {
        setBalance("");
        return;
      }
      const balance = await getBalance(config, {
        address,
        token:
          isDev() || isProd()
            ? DAOKEN_ADDRESS_CONFIG.dev.address
            : DAOKEN_ADDRESS_CONFIG.prod.address,
      });
      setBalance(formatEther(balance.value));
      return formatEther(balance.value);
    },
    {
      onError: (err) => exceptionHandler(err),
      refreshDeps: [address],
      ...options,
    }
  );

  return result;
}
