import { useRequest } from "ahooks";
import { Options } from "../types";
import { useAccount, useWriteContract } from "wagmi";
import { isDev, isProd } from "../utils";
import { bnb, bnbtestnet, mindnet, mindtestnet } from "../wagimConfig";
import { AIRDROP_ABI } from "../blockChain/abi";
import { exceptionHandler } from "../utils/exception";
import { waitForTransactionReceipt } from "wagmi/actions";
import { config } from "../wagimConfig";
import useValidateChainWalletLink from "./useValidateChainWalletLink";
import { estimateGasUtil } from "../utils/script";
import { useLov } from "@/store/useLov";

export default function useBnbAirdropClaim(
  options?: Options<unknown, [string, string[]]> & {
    waitForReceipt?: boolean;
  } & { mindPayGasSelf?: boolean }
) {
  const { chainId } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const { getContractAdress } = useLov();
  const result = useRequest(
    async (amount: string, proof: string[]) => {
      const airdropAddressArray = getContractAdress();
      const airdropAirdropBnbLaunchContractAddress = airdropAddressArray.find(
        (item) => item.key === "airdrop_bnb_launch"
      )?.value;
      if (!chainId || !airdropAirdropBnbLaunchContractAddress) {
        return;
      }
      const gasEstimate = await estimateGasUtil(
        AIRDROP_ABI,
        "claim",
        [amount, proof],
        airdropAirdropBnbLaunchContractAddress
      );
      const txHash = await writeContractAsync({
        abi: AIRDROP_ABI,
        functionName: "claim",
        address: airdropAirdropBnbLaunchContractAddress,
        args: [amount, proof],
        gas: gasEstimate + gasEstimate / BigInt(3),
      });
      if (!options?.waitForReceipt) {
        return txHash;
      }
      const receipt = await waitForTransactionReceipt(config, { hash: txHash });
      return receipt;
    },
    {
      manual: true,
      onError: (err) => exceptionHandler(err, "airdrop", AIRDROP_ABI),
      ...options,
    }
  );

  return result;
}
