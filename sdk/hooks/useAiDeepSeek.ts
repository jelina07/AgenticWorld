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

const url = process.env.NEXT_PUBLIC_API_URL + "/ai/deepseek/chat";

export default function useAiDeepSeek(options?: Options<any, any>) {
  const { address, chainId } = useAccount();
  const { signMessageAsync } = useSignMessage();
  dayjs.extend(utc);
  const result = useRequest(
    async (messages: any) => {
      const utcFormattedTime = dayjs.utc().format("YYYY-MM-DD HH:mm:ss");
      let signMessage = `Sign to confirm your DeepSeek query\n. No gas or fee required.\n Time(UTC):${utcFormattedTime}`;
      let signature: any, res;
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
          signMessage = parseStoredArray.find(
            (item: any) => item.address === address
          ).signMessage;
        } else {
          signature = await signMessageAsync({
            message: signMessage,
          });
          const currentSignObj = {
            address,
            signature,
            signMessage,
          };
          parseStoredArray.push(currentSignObj);
          localStorage.setItem("signature", JSON.stringify(parseStoredArray));
        }
      } else {
        signature = await signMessageAsync({
          message: signMessage,
        });
        const currentSignObj = {
          address,
          signature,
          signMessage,
        };
        localStorage.setItem("signature", JSON.stringify([currentSignObj]));
      }
      const getFetch = async () => {
        const response = await axios.post(url, {
          wallet: address,
          signature,
          signMessage,
          messages,
          chainId,
        });
        return response;
      };
      try {
        res = await getFetch();
      } catch (error: any) {
        if (error.response.status === 401) {
          signMessage = `Sign to confirm your DeepSeek query\n. No gas or fee required.\n Time(UTC):${utcFormattedTime}`;
          signature = await signMessageAsync({
            message: signMessage,
          });
          console.log("signature", signature);

          const storedArray = localStorage.getItem("signature")!;
          const parseStoredArray = JSON.parse(storedArray);

          const newStoredArray = parseStoredArray.filter(
            (item: any) => item.address !== address
          );
          const currentSignObj = {
            address,
            signature,
            signMessage,
          };
          newStoredArray.push(currentSignObj);
          localStorage.setItem("signature", JSON.stringify(newStoredArray));
          res = await getFetch();
        }
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
