import { useRef, useState } from "react";
import { Bubble, BubbleProps, Sender, Welcome } from "@ant-design/x";
import { App, Divider, Flex, GetProp, GetRef } from "antd";
import BubbleThink from "./BubbleThink";
import useAgentGetTokenIdStore from "@/store/useAgentGetTokenId";
import { useAccount } from "wagmi";

const rolesAsObject: GetProp<typeof Bubble.List, "roles"> = {
  ai: {
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

export default function Chat() {
  const { message } = App.useApp();
  const [value, setValue] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { isConnected } = useAccount();
  const agentTokenId = useAgentGetTokenIdStore((state) => state.agentTokenId);
  const isAgent = agentTokenId !== 0;
  const listRef = useRef<GetRef<typeof Bubble.List>>(null);
  const [count, setCount] = useState(0); // 0 welcome
  const queryNumber = 3;

  const sendMessage = () => {
    if (queryNumber) {
      setCount(count + 2);
    } else {
      message.warning("You have reached your maximum number of uses today");
    }
  };
  return (
    <div className="mt-[50px] deepseek-chat">
      <div className="px-[28px] py-[26px] bg-[#181818] rounded-[20px]">
        <div className="flex justify-between flex-wrap gap-[10px]">
          <span className="text-[18px] font-[800]">Try it yourself</span>
          <div className="rounded-[20px] bg-[#0B1110] border-[1px] h-[38px] leading-[38px] px-[10px] border-[var(--mind-deep-green)] flex items-center gap-[10px]">
            <img src="/icons/small-earth.svg" alt="small-earth" />
            <div className="text-[14px] font-[600] flex-shrink-0">
              <span>My query credits: </span>
              <span>{!isConnected ? "/" : !isAgent ? 0 : 3}</span>
            </div>
          </div>
        </div>
        <div className="text-[14px] font-[600] capitalize text-[var(--mind-brand)] text-right mt-[10px]">
          3 credits / day
        </div>
        <hr className="border-[var(--mind-grey)] mt-[5px]" />
        <div className="py-[30px]">
          <div className={`${count > 0 ? "hidden" : ""}`}>
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
                !isAgent
                  ? "Please create an Agent first !"
                  : "Hello, CitizenZ !"
              }
            />
          </div>

          <Bubble.List
            ref={listRef}
            style={{ maxHeight: 300 }}
            roles={rolesAsObject}
            items={Array.from({ length: count }).map((_, i) => {
              const contentType = (i + 1) % 3;
              const content =
                contentType === 1 ? (
                  <div className="max-w-[600px] bg-[#1C2925] rounded-[8px] px-[20px] py-[12px]">
                    Mock AI content
                  </div>
                ) : contentType === 2 ? (
                  <BubbleThink />
                ) : (
                  "Mock AI content. ".repeat(20)
                );

              return {
                key: i,
                role:
                  contentType === 1
                    ? "user"
                    : contentType === 2
                    ? "aiThink"
                    : "ai",
                content,
              };
            })}
          />
        </div>
        <Sender
          disabled={!isAgent || loading}
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
                  <SendButton
                    type="primary"
                    disabled={value === "" || !isAgent}
                    className="send-button"
                    onClick={sendMessage}
                  />
                </div>
              </div>
            );
          }}
          onSubmit={() => {
            setValue("");
            setLoading(true);
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
