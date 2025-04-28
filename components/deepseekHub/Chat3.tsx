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
import { BubbleDataType } from "@ant-design/x/es/bubble/BubbleList";

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
const url = isMainnet()
  ? "https://agent.mindnetwork.xyz/ai/deepseek/chat"
  : process.env.NEXT_PUBLIC_API_URL + "/ai/deepseek/chat";

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
  const { data: deepSeekCredit, refresh } = useGetDeepSeekCredit();
  const deepSeekCreditFormat = !deepSeekCredit ? 0 : deepSeekCredit.credits;

  const [agent] = useXAgent<BubbleDataType>({
    baseURL: "https://api.siliconflow.cn/v1/chat/completions",
  });

  const { messages, onRequest, setMessages } = useXChat({
    agent,
    requestFallback: (_, { error }) => {
      console.log("requestFallback", _);

      if (error.name === "AbortError") {
        return {
          content: "Request is aborted",
          role: "assistant",
        };
      }
      return {
        content: "Request failed, please try again!",
        role: "assistant",
      };
    },
    transformMessage: (info) => {
      const { originMessage, chunk } = info || {};
      let currentText = "";
      try {
        if (chunk?.data && !chunk?.data.includes("DONE")) {
          const message = JSON.parse(chunk?.data);
          currentText = !message?.choices?.[0].delta?.reasoning_content
            ? ""
            : message?.choices?.[0].delta?.reasoning_content;
        }
      } catch (error) {
        console.error(error);
      }
      return {
        content: (originMessage?.content || "") + currentText,
        role: "assistant",
      };
    },
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
