import { useRequest } from "ahooks";
import { Options } from "../../types";
import "whatwg-fetch";
import "promise-polyfill/src/polyfill";
import {
  bnb,
  bnbtestnet,
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
import { isDev, isMainnet, isMainnetio, isProd } from "@/sdk/utils";
import { createPublicClient, keccak256, toBytes } from "viem";
import axios from "axios";
import { useAccount, useSignMessage } from "wagmi";
import useAgentGetTokenIdStore from "@/store/useAgentGetTokenId";
import { message } from "antd";
import request from "@/sdk/request";

const signurl = isMainnet()
  ? "https://agent.mindnetwork.xyz/api/health-hub/sign-url"
  : isMainnetio()
  ? "https://agent.mindnetwork.io/api/health-hub/sign-url"
  : `/health-hub/sign-url`;

const signMessage =
  "Sign to authorize encryption and upload of your selected health data to the secure cloud endpoint";

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

const quryMindChainId = isDev() || isProd() ? mindtestnet.id : mindnet.id;
const targetChain: any = isDev() || isProd() ? bnbtestnet.id : bnb.id;
export default function useEncryptData(options?: Options<any, any>) {
  // const agentTokenId = useAgentGetTokenIdStore((state) => state.agentTokenId);
  // const isAgent = agentTokenId !== 0;
  // const { validateAsync, chainId, address } =
  //   useValidateChainWalletLink(targetChain);
  const { chainId, address } = useAccount();
  const { signMessageAsync } = useSignMessage();

  const result = useRequest(
    async (userInputBinary: string, content?: any) => {
      // const isValid = await validateAsync?.();
      if (!chainId) {
        return;
      }
      // if (!isAgent) {
      //   message.open({
      //     type: "warning",
      //     content: content,
      //     duration: 5,
      //   });
      //   return;
      // }
      //get publicKey
      const keySetId = (await publicClientMind.readContract({
        abi: WORLDAIHEALTHY_ABI,
        address: WORLAIHEALTHY_HUB_ADDRESS[quryMindChainId],
        functionName: "fheKeySetId",
      })) as string;
      console.log("keySetId", keySetId);
      const publicKeyUrlArray = (await publicClientMind.readContract({
        abi: FHEKEY_REGISTRY_ABI,
        address: FHEKEY_REGISTRY_ADDRESS[quryMindChainId],
        functionName: "fheKeySets",
        args: [keySetId],
      })) as Array<any>;

      const publicKeyUrl = publicKeyUrlArray[0].keyURL;
      console.log("publicKeyUrl", publicKeyUrl);
      const response = await fetch(publicKeyUrl);
      console.log("response", response);
      const sPublicKey = await response.text();
      console.log("sPublicKey", sPublicKey);
      const publicKey = paillier.deserializePublicKey(sPublicKey);
      console.log("publicKey", publicKey);

      const VOTER = new paillier.Voter(129, publicKey);
      const userInputBigInt = BigInt(`0b${userInputBinary}`);
      console.log("userInputInt", userInputBigInt);

      //EncryptData
      const proofs: string = await new Promise((resolve, reject) => {
        const worker = new Worker(
          new URL("./encrypt-worker.ts", import.meta.url),
          {
            type: "module",
          }
        );
        worker.onmessage = (e) => {
          const { success, proofs, error } = e.data;
          if (success) {
            resolve(proofs);
          } else {
            reject(new Error(error));
          }
          worker.terminate();
        };
        worker.onerror = (err) => {
          reject(err);
          worker.terminate();
        };
        worker.postMessage({ userInputBinary, sPublicKey });
      });
      console.log("proofs", typeof proofs, proofs);
      const hash = keccak256(toBytes(proofs));
      console.log("hash", hash);

      //upload proofs to google cloud
      const signature = await signMessageAsync({
        message: signMessage,
      });
      const googleCloudUrlObj = (await request.post(signurl, {
        bucket:
          isDev() || isProd() ? "world-ai-health-hub" : "world-ai-health-hub",
        fileHash: hash,
        walletAddress: address,
        message: signMessage,
        signature,
      })) as any;

      console.log("google cloud url", googleCloudUrlObj);
      const response2 = await axios.put(googleCloudUrlObj, proofs, {
        headers: {
          "Content-Type": "application/octet-stream",
        },
      });
      console.log("response2", response2);

      return {
        encryptHash: hash,
        proofs,
      };
    },
    {
      manual: true,
      onError: (err) => exceptionHandler(err),
      ...options,
    }
  );
  return result;
}
