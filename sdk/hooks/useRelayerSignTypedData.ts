import { useMemoizedFn, useRequest } from "ahooks";
import { TypedData } from "viem";
import { useAccount, useSignTypedData } from "wagmi";
import { AGENT_SIGVERIFY_ADDRESS, DAOKEN_ADDRESS } from "../blockChain/address";
import { exceptionHandler } from "../utils/exception";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { readContract } from "wagmi/actions";
import { config } from "../wagimConfig";
import { DAOTOKEN_ABI } from "../blockChain/abi";

dayjs.extend(utc);

const types = {
  Message: [
    { name: "user", type: "address" },
    { name: "agentID", type: "uint256" },
    { name: "hubID", type: "uint256" },
    { name: "action", type: "string" },
    { name: "amount", type: "uint256" },
    { name: "timestamp", type: "uint256" },
    { name: "nonce", type: "uint256" },
  ],
} as const satisfies TypedData;

const permitTypes = {
  Permit: [
    {
      name: "owner",
      type: "address",
    },
    {
      name: "spender",
      type: "address",
    },
    {
      name: "value",
      type: "uint256",
    },
    {
      name: "nonce",
      type: "uint256",
    },
    {
      name: "deadline",
      type: "uint256",
    },
  ],
};

type SignPayload = {
  user: string;
  agentID: number;
  hubID: number;
  action: string;
  amount: bigint; //最小单位
};

export default function useRelayerSignTypedData() {
  const { signTypedDataAsync } = useSignTypedData();
  const { chainId, address } = useAccount();

  const signRelayerAsync = async (payload: SignPayload) => {
    const verifyingContract = AGENT_SIGVERIFY_ADDRESS[chainId!];
    if (!verifyingContract) {
      throw new Error("Unsupported chain");
    }

    const domain = {
      name: "mindnetwork.xyz",
      version: "1",
      chainId: chainId,
      verifyingContract: verifyingContract,
    };
    const timestamp = dayjs().utc().unix();
    const signature = await signTypedDataAsync({
      domain,
      types,
      message: {
        user: payload.user as `0x${string}`,
        agentID: BigInt(payload.agentID),
        hubID: BigInt(payload.hubID),
        action: payload.action,
        amount: payload.amount,
        timestamp: BigInt(timestamp),
        nonce: BigInt(timestamp),
      },
      primaryType: "Message",
    });

    return { signature, timestamp, nonce: timestamp };
  };

  const signPermitAsync = async ({ spender, assetAmount }: { spender: string; assetAmount: bigint }) => {
    const verifyingContract = DAOKEN_ADDRESS[chainId!];
    if (!verifyingContract) {
      throw new Error("Unsupported chain");
    }

    const domain = {
      name: "MindNetwork FHE Token",
      version: "1",
      chainId: chainId,
      verifyingContract: verifyingContract,
    };

    const nonce = await readContract(config, {
      abi: DAOTOKEN_ABI,
      address: DAOKEN_ADDRESS[chainId!],
      functionName: "nonces",
      args: [address],
    });

    const deadline = dayjs().utc().unix() + 3600;

    const values = {
      owner: address,
      spender: spender,
      value: assetAmount,
      nonce: nonce,
      deadline: deadline,
    };

    const signature = await signTypedDataAsync({
      domain,
      types: permitTypes,
      message: values,
      primaryType: "Permit",
    });

    return {
      signature,
      spender,
      deadline,
    };
  };

  return {
    signRelayerAsync: useMemoizedFn(signRelayerAsync),
    signPermitAsync: useMemoizedFn(signPermitAsync),
  };
}
