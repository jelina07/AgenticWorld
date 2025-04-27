import { useEffect, useRef, useState } from "react";
import { Bubble, BubbleProps, Sender, Welcome } from "@ant-design/x";
import { App, Divider, Flex, GetProp, GetRef, message, Spin } from "antd";
import BubbleThink from "./BubbleThink";
import useAgentGetTokenIdStore from "@/store/useAgentGetTokenId";
import { useAccount } from "wagmi";
import {
  useAiDeepSeek,
  useAiDeepSeekStream,
  useGetDeepSeekCredit,
} from "@/sdk";
import { isMainnet } from "@/sdk/utils";
import axios from "axios";
import markdownit from "markdown-it";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAsyncEffect } from "ahooks";

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

export default function Chat() {
  const [value, setValue] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const agentTokenId = useAgentGetTokenIdStore((state) => state.agentTokenId);
  const isAgent = agentTokenId !== 0;
  const listRef = useRef<GetRef<typeof Bubble.List>>(null);
  const [bubbleList, setBubbleList] = useState<Array<any>>([]);
  const { runAsync: getAiResponse } = useAiDeepSeek();
  const { runAsync: getAiResponseStream } = useAiDeepSeekStream();
  const [generatedText, setGeneratedText] = useState("");
  const { data: deepSeekCredit, refresh } = useGetDeepSeekCredit();
  const deepSeekCreditFormat = !deepSeekCredit ? 0 : deepSeekCredit.credits;
  console.log("generatedText", generatedText);

  const sendMessage = async () => {
    if (isConnected) {
      if (deepSeekCreditFormat) {
        setLoading(true);
        const newItems = [
          ...bubbleList,
          {
            role: "user",
            content: (
              <div className="max-w-[600px] bg-[#1C2925] rounded-[8px] px-[20px] py-[12px]">
                {value}
              </div>
            ),
          },
          {
            role: "aiThink",
            content: <BubbleThink />,
          },
        ];
        setValue("");
        const message = newItems
          .filter((item: any) => item.role !== "aiThink")
          .map((item: any) => {
            let content;
            if (item.role === "user") {
              content = item.content.props.children;
            }
            if (item.role === "assistant") {
              content = item.content.props.dangerouslySetInnerHTML.__html;
            }
            return {
              ...item,
              content,
            };
          });
        console.log("message", message);
        try {
          const asRes = await getAiResponse(message);
          console.log("asRes", asRes);
          if (asRes) {
            setBubbleList(newItems);
            const newItems2 = [
              ...newItems,
              {
                role: "assistant",
                content: (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: md.render(
                        asRes.data.replace(/\[done\]$/, "").trim()
                      ),
                    }}
                  />
                ),
              },
            ];
            await new Promise((resolve) => setTimeout(resolve, 14000));
            setBubbleList(newItems2);
            refresh();
            setLoading(false);
          }
        } catch (error) {
          setLoading(false);
        }
      } else {
        message.open({
          type: "warning",
          content: `You have reached your maximum number of uses today`,
          duration: 5,
        });
        setLoading(false);
      }
    } else {
      openConnectModal?.();
    }
  };

  // const sendMessage = async () => {
  //   if (isConnected) {
  //     if (deepSeekCreditFormat) {
  //       setLoading(true);
  //       const newItems = [
  //         ...bubbleList,
  //         {
  //           role: "user",
  //           content: (
  //             <div className="max-w-[600px] bg-[#1C2925] rounded-[8px] px-[20px] py-[12px]">
  //               {value}
  //             </div>
  //           ),
  //         },
  //         {
  //           role: "aiThink",
  //           content: <BubbleThink />,
  //         },
  //       ];
  //       setValue("");
  //       const message = newItems
  //         .filter((item: any) => item.role !== "aiThink")
  //         .map((item: any) => {
  //           let content
  //           if (item.role === "user") {
  //             content = item.content.props.children;
  //           }
  //           if (item.role === "assistant") {
  //             content = item.content.props.dangerouslySetInnerHTML.__html;
  //           }
  //           return {
  //             ...item,
  //             content,
  //           };
  //         });
  //       const res = await getAiResponseStream(message, setGeneratedText);
  //       console.log("res", res);

  //       if (res) {
  //         setBubbleList(newItems);
  //       }
  //     } else {
  //       message.open({
  //         type: "warning",
  //         content: `You have reached your maximum number of uses today`,
  //         duration: 5,
  //       });
  //       setLoading(false);
  //     }
  //   } else {
  //     openConnectModal?.();
  //   }
  // };

  // useAsyncEffect(async () => {
  //   if (generatedText.length) {
  //     if (bubbleList.length + (1 % 3) !== 0) {
  //       const newItems2 = [
  //         ...bubbleList,
  //         {
  //           role: "assistant",
  //           content: (
  //             <div
  //               dangerouslySetInnerHTML={{ __html: md.render(generatedText) }}
  //             />
  //           ),
  //         },
  //       ];
  //       await new Promise((resolve) => setTimeout(resolve, 14000));
  //       setBubbleList(newItems2);
  //       refresh();
  //     } else {
  //       const updatedBubbleList = bubbleList.map((item, index) => {
  //         if (index === bubbleList.length - 1) {
  //           return {
  //             ...item,
  //             content: (
  //               <div
  //                 dangerouslySetInnerHTML={{ __html: md.render(generatedText) }}
  //               />
  //             ),
  //           };
  //         }
  //         return item;
  //       });
  //       setBubbleList(updatedBubbleList);
  //     }
  //     if (generatedText.includes("[done]")) setLoading(false);
  //   }
  // }, [generatedText]);

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
          <div className={`${bubbleList.length > 0 ? "hidden" : ""}`}>
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
            items={bubbleList}
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
            const { SendButton, LoadingButton } = components;
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
          // onSubmit={onSubmit}
          onSubmit={() => {
            sendMessage();
          }}
          onCancel={() => {
            setLoading(false);
          }}
          actions={false}
        />
      </div>
    </div>
  );
}
