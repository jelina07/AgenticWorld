import { useRequest } from "ahooks";
import { Options } from "../../types";
import {
  readContract,
  sendTransaction,
  waitForTransactionReceipt,
} from "wagmi/actions";
import {
  bnb,
  bnbtestnet,
  config,
  getTransports,
  mindnet,
  mindtestnet,
} from "../../wagimConfig";
import * as paillier from "mind-paillier-voting-sdk";
import {
  DEEPSEEK_HUB_ADDRESS,
  FHEKEY_REGISTRY_ADDRESS,
  WORLAIHEALTHY_HUB_ADDRESS,
} from "../../blockChain/address";
import { exceptionHandler } from "../../utils/exception";
import {
  DEEPSEEK_ABI,
  FHEKEY_REGISTRY_ABI,
  WORLDAIHEALTHY_ABI,
} from "@/sdk/blockChain/abi";
import useValidateChainWalletLink from "../useValidateChainWalletLink";
import { isDev, isProd } from "@/sdk/utils";
import { createPublicClient, keccak256, toBytes } from "viem";
import axios from "axios";
import { writeContract } from "viem/actions";

export default function useEncryptData(
  options?: Options<any, any>,
  waitForReceipt = true
) {
  const targetChain = isDev() || isProd() ? mindtestnet.id : mindnet.id;
  const { validateAsync, address, chainId } =
    useValidateChainWalletLink(targetChain);

  const result = useRequest(
    async (userInputBinary: string) => {
      const isValid = await validateAsync?.();
      if (!isValid || !chainId) {
        return;
      }

      const keySetId = (await readContract(config, {
        abi: WORLDAIHEALTHY_ABI,
        address: WORLAIHEALTHY_HUB_ADDRESS[chainId],
        functionName: "fheKeySetId",
      })) as string;
      console.log("keySetId", keySetId);

      const publicKeyUrlArray = (await readContract(config, {
        abi: FHEKEY_REGISTRY_ABI,
        address: FHEKEY_REGISTRY_ADDRESS[chainId],
        functionName: "fheKeySets",
        args: [keySetId],
      })) as Array<any>;

      const publicKeyUrl = publicKeyUrlArray[0].keyURL;
      console.log("publicKeyUrl", publicKeyUrl);
      const response = await fetch(publicKeyUrl);
      console.log("response", response);
      const sPublicKey = await response.text();

      console.log("sPublicKey", sPublicKey);
      console.log("paillier", paillier);

      const publicKey = paillier.deserializePublicKey(sPublicKey);

      console.log("publicKey", publicKey);

      const VOTER = new paillier.Voter(129, publicKey);
      const userInputBigInt = BigInt(`0b${userInputBinary}`);

      console.log("userInputInt", userInputBigInt);

      //EncryptData
      const proofs = JSON.stringify(
        //@ts-ignore
        VOTER.encryptNumber(userInputBigInt),
        (_, value) => (typeof value === "bigint" ? value.toString() : value)
      );
      console.log("proofs", typeof proofs, proofs);

      const hash = keccak256(toBytes(proofs));
      console.log("hash", hash);
      //upload proofs to google cloud
      const response1 = (await axios.post(
        "https://signed-url.mindnetwork.xyz/",
        {
          bucket: "world-ai-health-hub",
          filename: hash,
        }
      )) as any;
      console.log("google cloud url", response1);

      const encoder = new TextEncoder();
      const binaryData = encoder.encode(proofs);

      const response2 = axios.put(response1.data.url, proofs, {
        headers: {
          "Content-Type": "application/octet-stream",
        },
      });
      console.log("response2", response2);

      //send hash to chain

      // const txHash = await publicClientBsc.writeContract({});

      // if (!waitForReceipt) {
      //   return txHash;
      // }
      // const receipt = await waitForTransactionReceipt(config, {
      //   hash: txHash,
      // });
      // return receipt;
    },
    {
      manual: true,
      onError: (err) => exceptionHandler(err),
      ...options,
    }
  );
  return result;
}
