import { createPublicClient, keccak256, toBytes } from "viem";
import { FHEKEY_REGISTRY_ABI, WORLDAIHEALTHY_ABI } from "../blockChain/abi";
import {
  FHEKEY_REGISTRY_ADDRESS,
  WORLAIHEALTHY_HUB_ADDRESS,
} from "../blockChain/address";
import { getTransports, mindnet, mindtestnet } from "../wagimConfig";
import { isDev, isMainnet, isMainnetio, isProd } from ".";
import * as paillier from "mind-paillier-voting-sdk";
import axios from "axios";

const signurl = isMainnet()
  ? "https://agent.mindnetwork.xyz/api/health-hub/sign-url"
  : isMainnetio()
  ? "https://agent.mindnetwork.io/api/health-hub/sign-url"
  : `${process.env.NEXT_PUBLIC_API_URL}/health-hub/sign-url`;

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
self.onmessage = async function (e) {
  const { userInputBinary, address, signMessageAsync } = e.data;

  //get publicKey
  const keySetId = (await publicClientMind.readContract({
    abi: WORLDAIHEALTHY_ABI,
    address: WORLAIHEALTHY_HUB_ADDRESS[quryMindChainId],
    functionName: "fheKeySetId",
  })) as string;

  const publicKeyUrlArray = (await publicClientMind.readContract({
    abi: FHEKEY_REGISTRY_ABI,
    address: FHEKEY_REGISTRY_ADDRESS[quryMindChainId],
    functionName: "fheKeySets",
    args: [keySetId],
  })) as Array<any>;

  const publicKeyUrl = publicKeyUrlArray[0].keyURL;
  const response = await fetch(publicKeyUrl);
  const sPublicKey = await response.text();
  const publicKey = paillier.deserializePublicKey(sPublicKey);

  //EncryptData
  const VOTER = new paillier.Voter(129, publicKey);
  const userInputBigInt = BigInt(`0b${userInputBinary}`);
  //@ts-ignore
  const encrypted = VOTER.encryptNumber(userInputBigInt);
  // stringify
  const proofs = JSON.stringify(encrypted, (_, value) =>
    typeof value === "bigint" ? value.toString() : value
  );

  //hash
  const hash = keccak256(toBytes(proofs));

  //upload proofs to google cloud
  const signature = await signMessageAsync({
    message: signMessage,
  });
  const googleCloudUrlObj = (await axios.post(signurl, {
    bucket: isDev() || isProd() ? "world-ai-health-hub" : "world-ai-health-hub",
    fileHash: hash,
    walletAddress: address,
    message: signMessage,
    signature,
  })) as any;

  await axios.put(googleCloudUrlObj.data.data, proofs, {
    headers: {
      "Content-Type": "application/octet-stream",
    },
  });

  self.postMessage({ encryptHash: hash, proofs });
};
