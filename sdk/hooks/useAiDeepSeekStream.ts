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
import { useState } from "react";

const url = isMainnet()
  ? "https://agent.mindnetwork.xyz/ai/deepseek/chat"
  : process.env.NEXT_PUBLIC_API_URL + "/ai/deepseek/chat";

export default function useAiDeepSeekStream(options?: Options<any, any>) {
  const { address, chainId } = useAccount();
  const { signMessageAsync } = useSignMessage();
  dayjs.extend(utc);
  const result = useRequest(
    async (messages: any, setGeneratedText: Function) => {
      const utcFormattedTime = dayjs.utc().format("YYYY-MM-DD:HH:mm:ss");
      const signMessage = `Sign to confirm your DeepSeek query\n. No gas or fee required.\n Time(UTC):${utcFormattedTime}`;

      let signature: any;
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

      const getFetch = async () => {
        const response = await fetch(url, {
          method: "POST",
          body: JSON.stringify({
            wallet: address,
            signature,
            signMessage,
            messages,
            chainId,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        return response;
      };

      const response = await getFetch();
      console.log("response", response, response.body, response.status);
      if (response.body) {
        if (200 <= response.status && response.status <= 299) {
          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let a = "";
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value);
            console.log("chunk", chunk);
            a = a + chunk;
            setGeneratedText(a);
          }
          return true;
        } else if (response.status === 401) {
          signature = await signMessageAsync({
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
          const response = await getFetch();
          if (response.body) {
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let a = "";
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              const chunk = decoder.decode(value);
              console.log("chunk", chunk);
              a = a + chunk;
              setGeneratedText(a);
            }
            return true;
          } else {
            throw new Error("No response body");
          }
        } else {
          return false;
        }
      } else {
        throw new Error("No response body");
      }
    },
    {
      manual: true,
      ...options,
    }
  );

  return result;
}
