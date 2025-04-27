import { useRequest } from "ahooks";
import { Options } from "../types";
import request from "../request";
import { useAccount, useSignMessage } from "wagmi";
import { exceptionHandler } from "../utils/exception";
import useValidateChainWalletLink from "./useValidateChainWalletLink";
import { isMainnet } from "../utils";
import axios from "axios";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

const url = isMainnet()
  ? "https://agent.mindnetwork.xyz/ai/deepseek/chat"
  : process.env.NEXT_PUBLIC_API_URL + "/ai/deepseek/chat";

export default function useAiDeepSeek(options?: Options<any, any>) {
  const { address, chainId } = useAccount();
  const { signMessageAsync } = useSignMessage();
  dayjs.extend(utc);
  const result = useRequest(
    async (messages: any) => {
      const utcFormattedTime = dayjs.utc().format("YYYY-MM-DD:HH:mm:ss");
      const signMessage = `Sign to confirm your DeepSeek query\n. No gas or fee required.\n Time(UTC):${utcFormattedTime}`;

      let signature, res;
      const storedArray = localStorage.getItem("signature");
      if (storedArray) {
        const parseStoredArray = JSON.parse(storedArray);
        const currentAddress = parseStoredArray.find(
          (item: any) => item.address === address
        );
        if (currentAddress) {
          signature = parseStoredArray.find(
            (item: any) => item.address === address
          ).signature;
        } else {
          signature = await signMessageAsync({
            message: signMessage,
          });
          const currentSignObj = {
            address: address,
            signature: signature,
          };
          parseStoredArray.push(currentSignObj);
          localStorage.setItem("signature", JSON.stringify(parseStoredArray));
        }
      } else {
        signature = await signMessageAsync({
          message: signMessage,
        });
        const currentSignObj = {
          address: address,
          signature: signature,
        };
        localStorage.setItem("signature", JSON.stringify([currentSignObj]));
      }

      res = await axios.post(url, {
        wallet: address,
        signature,
        signMessage,
        messages,
        chainId,
      });
      if (res.status === 401) {
        const signature = await signMessageAsync({
          message: signMessage,
        });
        const storedArray = localStorage.getItem("signature")!;
        const parseStoredArray = JSON.parse(storedArray);
        const currentSignObj = {
          address: address,
          signature: signature,
        };
        parseStoredArray.push(currentSignObj);
        localStorage.setItem("signature", JSON.stringify(parseStoredArray));
        res = await axios.post(url, {
          wallet: address,
          signature,
          signMessage,
          messages,
          chainId,
        });
      }
      return res;
    },
    {
      manual: true,
      ...options,
    }
  );

  return result;
}
