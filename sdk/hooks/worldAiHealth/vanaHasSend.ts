// import { getContractAddress } from "@/sdk/blockChain/address";
// import { Options } from "@/sdk/types";
// import { exceptionHandler } from "@/sdk/utils/exception";

// import { useRequest } from "ahooks";
// import { erc20Abi, formatEther } from "viem";
// import { readContract } from "wagmi/actions";
// import { useAccount } from "wagmi";
// import { config } from "@/sdk/wagimConfig";

// export default function useAgentGetStakeAmount(
//   options?: Options<string | undefined, []> & { tokenId?: number }
// ) {
//   const { tokenId, ...rest } = options || {};
//   const { chainId } = useAccount();
//   const result = useRequest(
//     async () => {
//       if (!chainId) {
//         return;
//       }
//       const rewardAddress = getContractAddress(chainId, "vanaReward");
//       const amount = (await readContract(config, {
//         abi: erc20Abi,
//         address: rewardAddress,
//         functionName: "balanceOf",
//       })) as bigint;
//       return formatEther(amount);
//     },
//     {
//       onError: (err) => exceptionHandler(err),
//       refreshDeps: [tokenId, chainId],
//       ...rest,
//     }
//   );

//   return result;
// }
