import { useRequest } from "ahooks";
import { Options } from "../../types";
import request from "@/sdk/request";
import { useAccount, useSignMessage } from "wagmi";
import * as openpgp from "openpgp";
import axios from "axios";
import { config } from "../../wagimConfig";
import eccrypto from "eccrypto";
import {
  DataLiquidityPoolImplementationAbi,
  DataRegistryImplementationAbi,
  TeePoolImplementationAbi,
} from "@/sdk/blockChain/abi";
import { getContractAddress } from "@/sdk/blockChain/address";
import { waitForTransactionReceipt, readContract, writeContract } from "wagmi/actions";
import { Log, parseEventLogs, TransactionReceipt } from "viem";
import { useState } from "react";
import { exceptionHandler } from "@/sdk/utils/exception";

const SIGN_MESSAGE = "Please sign to retrieve your encryption key";

type FileAddedEventArgs = {
  fileId: bigint;
  ownerAddress: `0x${string}`; // viem uses branded string type for addresses
  url: string;
};
interface JobData {
  teeAddress: string;
  [key: string]: unknown;
}

interface TeeData {
  url: string;
  publicKey: string;
  [key: string]: unknown;
}

interface ProofRequestBody {
  job_id: number;
  file_id: number;
  nonce: string;
  proof_url: string;
  encryption_seed: string;
  env_vars: {};
  validate_permissions: {
    address: string;
    public_key: string;
    iv: string;
    ephemeral_key: string;
  }[];
  encrypted_encryption_key?: string;
  encryption_key?: string;
}

/**
 * step
 * 1:Recording encrypted data on the VANA network
 * 2:Running proof-of-contribution in trusted environment
 * 3:Recording validation proof on-chain
 */

const NEXT_PUBLIC_PROOF_URL =
  "https://github.com/joshuamind/vana-satya-proof-template-py/releases/download/v12/my-proof-12.tar.gz";

export default function useVanaSend(options?: Options<string, any>) {
  const { signMessageAsync } = useSignMessage();
  const { chainId } = useAccount();
  const [step, setStep] = useState<number>(1);

  const result = useRequest(
    async (walletAddress: string) => {
      const info = await request.post<any, any>("/health-hub/sign-message", {
        walletAddress,
        contractAddress: "0x3aa0bc0182209C37f52A512E119CFE663f014398", // 没有用处，只是为了获取签名
      });
      setStep(1);
      const signature = await signMessageAsync?.({
        message: SIGN_MESSAGE,
      });
      const fileHash = "vana_" + info.fileHash;
      console.log("fileHash:", fileHash);

      let uploaded = false;

      try {
        const response = await axios.request({
          method: "HEAD",
          url: `https://fcno.mindnetwork.xyz/${fileHash}`,
          validateStatus: (status) => true, // 只接受 200，其他抛错
        });

        if (response.status === 200) {
          uploaded = true;
        }
      } catch {}

      if (!uploaded) {
        // 上传到google
        await uploadToStorage(walletAddress, fileHash, signature);
      }

      const downloadUrl = `https://fcno.mindnetwork.xyz/${fileHash}`;

      // 将downloadUrl 注册到 vana的DataRegistry合约
      const { fileId, encryptedKey, publicKey } = await addFileToDataRegistry(
        walletAddress,
        downloadUrl,
        signature,
        chainId as number
      );
      setStep(2);
      await requestContributionProof(chainId as number, fileId, signature, publicKey);
      setStep(3);
      await claimReward(chainId as number, fileId);
      return ""; // Return the string data, not the AxiosResponse
    },
    {
      manual: true,
      onError: (err) => exceptionHandler(err),
      ...options,
    }
  );

  return { ...result, step };
}

async function uploadToStorage(walletAddress: string, fileHash: string, signature: string) {
  const dataPackage = {
    walletAddress,
    fileHash,
  };
  const fileString = JSON.stringify(dataPackage);
  const fileBlob = new Blob([fileString], { type: "application/json" });
  // 调用加密方法
  const encryptedBlob = await clientSideEncrypt(fileBlob, signature);

  // 获取google bucket的上传链接
  const uploadUrl = (await request.post("/health-hub/vana/sign-url", {
    walletAddress,
    fileHash: `${fileHash}`,
    bucket: "world-ai-health-hub",
    signature,
    message: SIGN_MESSAGE,
  })) as string;
  console.log("🚀 ~ uploadToStorage ~ uploadUrl:", uploadUrl);
  // 将 Blob 转成 ArrayBuffer
  const arrayBuffer = await encryptedBlob.arrayBuffer();
  // 使用 axios.put 上传文件
  const response = await axios.put(uploadUrl, Buffer.from(arrayBuffer), {
    headers: {
      "Content-Type": "application/octet-stream",
      // 如果 Google Cloud Storage 要求 Content-Type 一致，可以调整
    },
    maxBodyLength: Infinity, // 允许上传大文件
    maxContentLength: Infinity,
  });

  if (response.status === 200) {
    console.log("✅ 文件上传成功");
  } else {
    console.error("❌ 文件上传失败", response.status, response.statusText);
    throw new Error(`File upload failed with status ${response.status}`);
  }
}

export async function clientSideEncrypt(data: Blob, signature: string): Promise<Blob> {
  const dataBuffer = await data.arrayBuffer();
  const message = await openpgp.createMessage({
    binary: new Uint8Array(dataBuffer),
  });

  const encrypted = await openpgp.encrypt({
    message,
    passwords: [signature],
    format: "binary",
  });

  // Convert WebStream<Uint8Array> to Blob
  const response = new Response(encrypted as ReadableStream<Uint8Array>);
  const arrayBuffer = await response.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);

  const encryptedBlob = new Blob([uint8Array], {
    type: "application/octet-stream",
  });
  return encryptedBlob;
}

async function addFileToDataRegistry(walletAddress: string, downloadUrl: string, signature: string, chainId: number) {
  const abi = DataLiquidityPoolImplementationAbi;
  const address = getContractAddress(chainId, "DataLiquidityPoolProxy");
  const publicKey = await readContract(config, {
    address,
    abi,
    functionName: "publicKey",
    args: [],
  });
  console.log("🚀 ~ addFileToDataRegistry ~ publicKey:", publicKey);
  const encryptedKey = await encryptWithWalletPublicKey(signature, publicKey);
  console.log("🚀 ~ addFileToDataRegistry ~ encryptedKey:", encryptedKey);
  //Send transaction to add file with permissions to DataRegistry
  const dataRegistryAddress = getContractAddress(14800, "DataRegistryProxy");
  const dataRegistryAbi = DataRegistryImplementationAbi;
  const tx = await writeContract(config, {
    address: dataRegistryAddress,
    abi: dataRegistryAbi,
    functionName: "addFileWithPermissions",
    args: [
      downloadUrl,
      walletAddress, //用户地址
      [
        {
          account: address,
          key: encryptedKey,
        },
      ],
    ],
  });
  const txReceipt = await waitForTransactionReceipt(config, {
    hash: tx,
  });
  console.log("🚀 ~ addFileToDataRegistry ~ txReceipt:", txReceipt.transactionHash);
  //获取fileId
  const fileId = extractFileIdFromReceipt(txReceipt);
  console.log("🚀 ~ addFileToDataRegistry ~ fileId:", fileId);
  return { fileId, encryptedKey, signature, publicKey };
}

const encryptWithWalletPublicKey = async (data: string, publicKey: string): Promise<string> => {
  // Get consistent encryption parameters
  const { iv, ephemeralKey } = getEncryptionParameters();

  const publicKeyBytes = Buffer.from(publicKey.startsWith("0x") ? publicKey.slice(2) : publicKey, "hex");
  const uncompressedKey =
    publicKeyBytes.length === 64 ? Buffer.concat([Buffer.from([4]), publicKeyBytes]) : publicKeyBytes;

  const encryptedBuffer = await eccrypto.encrypt(uncompressedKey, Buffer.from(data), {
    iv: Buffer.from(iv),
    ephemPrivateKey: Buffer.from(ephemeralKey),
  });

  const encryptedHex = Buffer.concat([
    encryptedBuffer.iv,
    encryptedBuffer.ephemPublicKey,
    encryptedBuffer.ciphertext,
    encryptedBuffer.mac,
  ]).toString("hex");

  return encryptedHex;
};

let generatedIV: Uint8Array | null = null;
let generatedEphemeralKey: Uint8Array | null = null;

/**
 * Generate or retrieve the encryption parameters (IV and ephemeral key)
 * Ensures the same values are used across multiple calls
 * @returns An object containing the IV and ephemeral key
 */
export function getEncryptionParameters() {
  if (!generatedIV || !generatedEphemeralKey) {
    // 16-byte initialization vector (fixed value)
    generatedIV = new Uint8Array([
      0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f, 0x10,
    ]);

    // 32-byte ephemeral key (fixed value)
    generatedEphemeralKey = new Uint8Array([
      0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88, 0x99, 0xaa, 0xbb, 0xcc, 0xdd, 0xee, 0xff, 0x00, 0x10, 0x20, 0x30,
      0x40, 0x50, 0x60, 0x70, 0x80, 0x90, 0xa0, 0xb0, 0xc0, 0xd0, 0xe0, 0xf0, 0x00,
    ]);
  }

  return {
    iv: generatedIV,
    ephemeralKey: generatedEphemeralKey,
    ivHex: Buffer.from(generatedIV).toString("hex"),
    ephemeralKeyHex: Buffer.from(generatedEphemeralKey).toString("hex"),
  };
}

export function extractFileIdFromReceipt(receipt: TransactionReceipt): number {
  try {
    // Ensure receipt exists and has logs
    if (!receipt || !receipt.logs || receipt.logs.length === 0) {
      throw new Error("Transaction receipt has no logs");
    }

    // Parse the event logs using viem's parseEventLogs
    const logs = parseEventLogs({
      abi: DataRegistryImplementationAbi,
      logs: receipt.logs as Log[],
      eventName: "FileAdded",
    });

    // Check if the FileAdded event was emitted
    if (logs.length === 0) {
      throw new Error("No FileAdded event found in transaction receipt");
    }

    // Safely cast the first log to the expected event type
    const fileAddedEvent = logs[0] as unknown as {
      args: FileAddedEventArgs;
      eventName: "FileAdded";
    };

    // Extract fileId from the event arguments
    const fileId = Number(fileAddedEvent.args.fileId);

    // Log for debugging purposes
    console.log("FileAdded event parsed:", {
      fileId,
      ownerAddress: fileAddedEvent.args.ownerAddress,
      url: fileAddedEvent.args.url,
    });

    return fileId;
  } catch (error) {
    console.error("Error extracting file ID from receipt:", error);
    throw new Error("Failed to extract file ID from transaction receipt");
  }
}

async function requestContributionProof(chainId: number, fileId: number, signature: string, publicKey: string) {
  const teePoolAddress = getContractAddress(chainId, "TeePoolProxy");
  const teePoolAbi = TeePoolImplementationAbi;
  //Request contribution proof
  const hash = await writeContract(config, {
    address: teePoolAddress,
    abi: teePoolAbi,
    functionName: "requestContributionProof",
    args: [fileId],
  });

  const contributionProofReceipt = await waitForTransactionReceipt(config, {
    hash,
    confirmations: 1,
  });
  console.log("🚀 ~ requestContributionProof ~ contributionProofReceipt:", contributionProofReceipt);

  const jobIds = (await readContract(config, {
    address: teePoolAddress,
    abi: teePoolAbi,
    functionName: "fileJobIds",
    args: [fileId],
  })) as readonly bigint[];

  if (jobIds.length === 0) {
    throw new Error("No jobs found for file");
  }
  // Get the latest job ID
  const latestJobId = jobIds[jobIds.length - 1];

  // Get job details
  const job = (await readContract(config, {
    address: teePoolAddress,
    abi: teePoolAbi,
    functionName: "jobs",
    args: [latestJobId],
  })) as JobData;

  if (!job || !job.teeAddress) {
    throw new Error("Job not found or missing TEE address");
  }

  // Then get the TEE info using the tee address from the job
  const teeInfo = (await readContract(config, {
    address: teePoolAddress,
    abi: teePoolAbi,
    functionName: "tees",
    args: [job.teeAddress],
  })) as TeeData;

  if (!teeInfo) {
    throw new Error("TEE information not found");
  }

  const jobDetails = {
    teeUrl: teeInfo.url,
    teePublicKey: teeInfo.publicKey,
    teeAddress: job.teeAddress,
  };
  console.log("🚀 ~ requestContributionProof ~ jobDetails:", jobDetails);

  // Get consistent encryption parameters
  const { ivHex, ephemeralKeyHex } = getEncryptionParameters();

  const dataLiquidityPoolAddress = getContractAddress(chainId, "DataLiquidityPoolProxy");

  // Create the proof request
  const nonce = Date.now().toString();
  const requestBody: ProofRequestBody = {
    job_id: Number(latestJobId),
    file_id: fileId,
    nonce,
    proof_url: NEXT_PUBLIC_PROOF_URL,
    encryption_seed: SIGN_MESSAGE,
    env_vars: {
      // Add the Google token directly from the session
    },
    validate_permissions: [
      {
        address: dataLiquidityPoolAddress,
        public_key: publicKey,
        iv: ivHex,
        ephemeral_key: ephemeralKeyHex,
      },
    ],
  };

  requestBody.encryption_key = signature;
  console.log("🚀 ~ requestContributionProof ~ requestBody:", requestBody);

  const contributionProofResponse = await axios.post(
    `${jobDetails.teeUrl}/RunProof`,
    requestBody, // 直接传对象，axios 会自动 JSON 序列化
    {
      headers: {
        "Content-Type": "application/json",
      },
      validateStatus: () => true, // 自己处理状态码，不让 axios 自动抛异常
    }
  );
  console.log("🚀 ~ requestContributionProof ~ contributionProofResponse.data:", contributionProofResponse.data);
  // 手动判断状态码
  if (contributionProofResponse.status < 200 || contributionProofResponse.status >= 300) {
    throw new Error(`TEE request failed: ${JSON.stringify(contributionProofResponse.data)}`);
  }

  const proofData = contributionProofResponse.data;
  console.log("🚀 ~ requestContributionProof ~ proofData:", proofData);

  return {
    fileId,
    jobId: latestJobId,
    proofData,
    txHash: contributionProofReceipt.transactionHash,
  };
}

async function claimReward(chainId: number, fileId: number) {
  const abi = DataLiquidityPoolImplementationAbi;
  const address = getContractAddress(chainId, "DataLiquidityPoolProxy");

  const hash = await writeContract(config, {
    address,
    abi,
    functionName: "requestReward",
    args: [BigInt(fileId), BigInt(1)], // Convert both values to bigint
  });

  // Wait for transaction receipt
  const txReceipt = await waitForTransactionReceipt(config, {
    hash,
    confirmations: 1,
  });
  console.log("🚀 ~ claimReward ~ txReceipt:", txReceipt.transactionHash);
}
