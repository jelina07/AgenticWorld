import { generateRandomArray } from "@/utils/utils";
import { Progress, ProgressProps } from "antd";
import { useEffect, useState } from "react";
const texts = [
  "Receiving your question",
  "Verifying DeepSeek Model Integrity (FHE-Protected)",
  "1. Checking if this is the genuine DeepSeek R1 model — encrypting node votes with FHE",
  "2. Decrypting consensus from nodes",
  "Model verified — beginning reasoning...",
  "Generating your answer with DeepSeek intelligence.",
  "Ready to Respond",
];

// const randomTime = Math.floor(Math.random() * (3000 - 1000 + 1)) + 1000;

const conicColors: ProgressProps["strokeColor"] = {
  "0%": "#00FFB1",
  "70%": "#00996A",
  "100%": "#FFF",
};
const randomArray = generateRandomArray();

export default function BubbleThink({
  BubbleThinkKey,
  changeBubbleThinkId,
  bubbleThinkId,
}: {
  BubbleThinkKey?: number | string;
  changeBubbleThinkId?: Function;
  bubbleThinkId?: Array<any>;
}) {
  const [percent, setPercent] = useState<number>(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < texts.length - 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => prevIndex + 1);
        setPercent((prevPercent) => {
          const newPercent = prevPercent + randomArray[currentIndex] || 0;
          if (newPercent > 100) {
            return 100;
          }
          return newPercent;
        });
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [currentIndex, texts.length]);

  useEffect(() => {
    if (percent === 100) {
      changeBubbleThinkId && changeBubbleThinkId(BubbleThinkKey);
    }
  }, [percent]);

  return bubbleThinkId?.includes(BubbleThinkKey) ? (
    <div className="bg-[#2f2f2f] rounded-[8px] px-[20px] py-[12px]">
      <Progress percent={percent} type="line" strokeColor={conicColors} />
      <div className="text-[#D9D9D9] text-[14px] font-[500] mt-[10px]">
        {texts.map((text, index) => (
          <div
            key={index}
            className={index === texts.length - 1 ? "highlight" : ""}
          >
            {text}
          </div>
        ))}
      </div>
    </div>
  ) : (
    <div className="bg-[#2f2f2f] rounded-[8px] px-[20px] py-[12px]">
      <Progress percent={percent} type="line" strokeColor={conicColors} />
      <div className="text-[#D9D9D9] text-[14px] font-[500] mt-[10px]">
        {texts.slice(0, currentIndex).map((text, index) => (
          <div
            key={index}
            className={
              index === texts.slice(0, currentIndex).length - 1
                ? "highlight"
                : ""
            }
          >
            {text}
          </div>
        ))}
      </div>
    </div>
  );
}
