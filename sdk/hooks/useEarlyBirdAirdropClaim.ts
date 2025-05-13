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

export default function useEarlyBirdAirdropClaim(
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
      const AIRDROP_ADDRESSByService =
        chainId === bnbtestnet.id || chainId === bnb.id
          ? airdropAddressArray.find(
              (item) => item.key === "aidrop_early_bird_bsc"
            )?.value
          : chainId === mindtestnet.id || chainId === mindnet.id
          ? airdropAddressArray.find(
              (item) => item.key === "aidrop_early_bird_mind"
            )?.value
          : "0x";

      if (!chainId || !AIRDROP_ADDRESSByService) {
        return;
      }
      const gasEstimate = await estimateGasUtil(
        AIRDROP_ABI,
        "claim",
        [amount, proof],
        AIRDROP_ADDRESSByService
      );
      const txHash = await writeContractAsync({
        abi: AIRDROP_ABI,
        functionName: "claim",
        address: AIRDROP_ADDRESSByService,
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
