import { useEffect, useRef, useState } from "react";
import {
  Bubble,
  BubbleProps,
  Sender,
  useXAgent,
  useXChat,
  Welcome,
} from "@ant-design/x";
import { App, Divider, Flex, GetProp, GetRef, message, Spin } from "antd";
import BubbleThink from "./BubbleThink";
import useAgentGetTokenIdStore from "@/store/useAgentGetTokenId";
import { useAccount, useSignMessage } from "wagmi";
import {
  useAiDeepSeek,
  useAiDeepSeekStream,
  useGetDeepSeekCredit,
} from "@/sdk";
import { isMainnet } from "@/sdk/utils";
import axios from "axios";
import markdownit from "markdown-it";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";

const rolesAsObject: GetProp<typeof Bubble.List, "roles"> = {
  assistant: {
    placement: "start",
    avatar: {
      icon: <div className="rounded-[50%]"></div>,
      style: { background: "transparent" },
    },
    typing: { step: 5, interval: 20 },
  },
  aiThink: {
    placement: "start",
    avatar: {
      icon: <img src="/icons/small-earth.svg" alt="small-earth" width={35} />,
    },
    typing: { step: 5, interval: 20 },
  },
  user: {
    placement: "end",
  },
};
const md = markdownit({ html: true, breaks: true });
const url = process.env.NEXT_PUBLIC_API_URL + "/ai/deepseek/chat";

export default function Chat2() {
  const [value, setValue] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { isConnected, address, chainId } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { signMessageAsync } = useSignMessage();
  const [bublist, setBublist] = useState<any>();
  const agentTokenId = useAgentGetTokenIdStore((state) => state.agentTokenId);
  const isAgent = agentTokenId !== 0;
  const listRef = useRef<GetRef<typeof Bubble.List>>(null);
  const { data: deepSeekCredit, refresh, runAsync } = useGetDeepSeekCredit();
  const deepSeekCreditFormat = !deepSeekCredit ? 0 : deepSeekCredit.credits;

  const [agent] = useXAgent({
    request: async (
      { message: userMessage, messages },
      { onSuccess, onUpdate }
    ) => {
      console.log("messages11", messages);
      const utcFormattedTime = dayjs.utc().format("YYYY-MM-DD HH:mm:ss");
      let signMessage = `Sign to confirm your DeepSeek query\n. No gas or fee required.\n Time(UTC):${utcFormattedTime}`;
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
          signMessage = parseStoredArray.find(
            (item: any) => item.address === address
          ).signMessage;
        } else {
          try {
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
          } catch (error) {
            setLoading(false);
          }
        }
      } else {
        try {
          signature = await signMessageAsync({
            message: signMessage,
          });
          const currentSignObj = {
            address,
            signature,
            signMessage,
          };
          localStorage.setItem("signature", JSON.stringify([currentSignObj]));
        } catch (error) {
          setLoading(false);
        }
      }
      const credti = await runAsync();
      console.log("credti", credti);
      if (credti && credti.credits) {
        messages?.push("ai");
        const allMess =
          messages?.map((item: any, index: number) => {
            if ((index + 1) % 3 === 1) {
              return {
                id: uuidv4(),
                status: "local",
                message: item,
              };
            } else if ((index + 1) % 3 === 2) {
              return {
                id: uuidv4(),
                status: "aiThink",
                message: item,
              };
            } else {
              return {
                id: uuidv4(),
                status: "assistant",
                message: item,
              };
            }
          }) || [];

        // const allMess = [
        //   {
        //     id: uuidv4(),
        //     status: "local",
        //     message: userMessage!,
        //   },
        //   {
        //     id: uuidv4(),
        //     status: "aiThink",
        //     message: "",
        //   },
        // ] as any;
        const putMessages = allMess
          ?.filter((item: any) => item.status !== "aiThink")
          .map((item: any) => {
            let role;
            if (item.status === "local") {
              role = "user";
            } else if (item.status === "assistant") {
              role = "assistant";
            }
            return {
              key: item.id,
              role: role,
              content: item.message,
            };
          });

        const getFetch = async () => {
          const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify({
              wallet: address,
              signature,
              signMessage,
              messages: putMessages,
              chainId,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          });
          return response;
        };
        const response = await getFetch();

        if (response.body) {
          if (200 <= response.status && response.status <= 299) {
            //@ts-ignore
            setMessages(allMess);
            await new Promise((resolve) => setTimeout(resolve, 14000));
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let a = "";
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              const chunk = decoder.decode(value);
              console.log("chunk", chunk);
              a = a + chunk;
              if (a.includes("[done]")) {
                //@ts-ignore
                onSuccess(a);
              } else {
                //@ts-ignore
                onUpdate(a);
              }
            }
            refresh();
            setLoading(false);
          } else if (response.status === 401) {
            try {
              signMessage = `Sign to confirm your DeepSeek query\n. No gas or fee required.\n Time(UTC):${utcFormattedTime}`;
              signature = await signMessageAsync({
                message: signMessage,
              });
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
              const response = await getFetch();
              //@ts-ignore
              setMessages(allMess);
              await new Promise((resolve) => setTimeout(resolve, 14000));
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
                  if (a.includes("[done]")) {
                    //@ts-ignore
                    onSuccess(a);
                  } else {
                    //@ts-ignore
                    onUpdate(a);
                  }
                }
                refresh();
                setLoading(false);
              } else {
                throw new Error("No response body");
              }
            } catch (error) {
              setLoading(false);
            }
          }
        } else {
          throw new Error("No response body");
        }
      } else {
        message.open({
          type: "warning",
          content: `You have reached your maximum number of uses today`,
          duration: 5,
        });
        setLoading(false);
      }
    },
  });

  const { onRequest, messages, setMessages } = useXChat({
    agent,
  });

  const onSubmit = (nextContent: string) => {
    if (isConnected) {
      setLoading(true);
      if (!nextContent) return;
      onRequest(nextContent);
      setValue("");
    } else {
      openConnectModal?.();
    }
  };

  console.log("messagesall", messages);

  const items: GetProp<typeof Bubble.List, "items"> = messages.map(
    ({ id, message, status }) => ({
      key: id,
      role:
        status === "local"
          ? "user" //@ts-ignore
          : status === "aiThink"
          ? "aiThink"
          : "assistant",
      content:
        status === "local" ? (
          <div className="max-w-[600px] bg-[#1C2925] rounded-[8px] px-[20px] py-[12px]">
            {message}
          </div>
        ) : //@ts-ignore
        status === "aiThink" ? (
          <BubbleThink />
        ) : (
          <div
            dangerouslySetInnerHTML={{
              __html: md.render(message.replace(/\[done\]$/, "").trim()),
            }}
          />
        ),
    })
  );

  return (
    <div className="mt-[50px] deepseek-chat">
      <div className="px-[28px] py-[26px] bg-[#181818] rounded-[20px]">
        <div className="flex justify-between flex-wrap gap-[10px]">
          <span className="text-[18px] font-[800]">Try it yourself</span>
          <div className="rounded-[20px] bg-[#0B1110] border-[1px] h-[38px] leading-[38px] px-[10px] border-[var(--mind-deep-green)] flex items-center gap-[10px]">
            <img src="/icons/small-earth.svg" alt="small-earth" />
            <div className="text-[14px] font-[600] flex-shrink-0">
              <span>My query credits: </span>
              <span>
                {!isConnected ? "/" : !isAgent ? 0 : deepSeekCreditFormat}
              </span>
            </div>
          </div>
        </div>
        <div className="text-[14px] font-[600] capitalize text-[var(--mind-brand)] text-right mt-[10px]">
          3 credits / day
        </div>
        <hr className="border-[var(--mind-grey)] mt-[5px]" />
        <div className="py-[30px]">
          <div className={`${items.length > 0 ? "hidden" : ""}`}>
            <Welcome
              rootClassName="deepseek-welcome"
              icon={
                <img
                  src="/icons/small-earth.svg"
                  alt="small-earth"
                  width={35}
                />
              }
              title={
                !isAgent && isConnected
                  ? "Please create an Agent first !"
                  : "Hello, CitizenZ !"
              }
            />
          </div>

          <Bubble.List
            ref={listRef}
            style={{ maxHeight: 300 }}
            roles={rolesAsObject}
            items={items}
          />
        </div>
        <Sender
          disabled={!isAgent && isConnected}
          rootClassName="deepseek-sender"
          placeholder="How can I help you today?"
          loading={loading}
          value={value}
          onChange={setValue}
          autoSize={{ minRows: 2 }}
          footer={({ components }) => {
            const { SendButton } = components;
            return (
              <div className="flex justify-between items-center gap-[10px] flex-wrap">
                <div className="inline-flex gap-[8px] px-[20px] py-[4px] border border-[var(--mind-brand)] rounded-[100px] items-center">
                  <img src="/icons/deepThink.svg" alt="deepThink" />
                  <span className="text-[12px] text-[var(--mind-brand)]">
                    DeepThink (R1)
                  </span>
                </div>
                <div>
                  {
                    <SendButton
                      type="primary"
                      disabled={
                        value === "" || (!isAgent && isConnected) || loading
                      }
                      className="send-button"
                      loading={loading}
                    />
                  }
                </div>
              </div>
            );
          }}
          onSubmit={onSubmit}
          onCancel={() => {
            setLoading(false);
          }}
          actions={false}
        />
      </div>
    </div>
  );
}
