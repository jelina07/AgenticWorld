import React from "react";
import { Image } from "antd";

export default function UseCase({ currentSubnet }: { currentSubnet: any }) {
  const morInfoArray = currentSubnet?.moreInfo
    ?.split(",")
    .map((item: string) => {
      const [type, link] = item.split("#");
      return {
        type: type.trim(),
        link: link.trim(),
      };
    });
  console.log("morInfoArray", morInfoArray);

  return (
    <div className="px-[28px] py-[40px] rounded-[20px] bg-[var(--bg-deep-grey)]">
      <div className="text-[18px] font-[700] capitalize">Use Case</div>
      <div className="mt-[15px] text-[12px] leading-[1.1]">
        <div
          dangerouslySetInnerHTML={{
            __html: currentSubnet?.usecase || "",
          }}
        />
      </div>
      <div className={`mt-[15px] ${currentSubnet?.moreInfo ? "" : "hidden"}`}>
        <div className="text-[14px] font-[600]">More Information:</div>
        <div className="flex gap-[5px]">
          {morInfoArray?.map((item: any) => (
            <div>
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--mind-brand)] text-[14px] underline hover:underline hover:text-[var(--mind-brand)]"
              >
                {item.type}
              </a>
            </div>
          ))}
        </div>
      </div>
      <div
        className={`mt-[15px] ${currentSubnet?.frameworkUrl ? "" : "hidden"}`}
      >
        <div className="text-[14px] font-[600]">Framework:</div>
        <Image className="w-full mt-[10px]" src={currentSubnet?.frameworkUrl} />
      </div>
      <div className={`mt-[15px]`}>
        <div className="text-[14px] font-[600]">Preview:</div>
        <Image
          className="w-full mt-[10px]"
          src="/images/deepseek-preview.png"
        />
      </div>
    </div>
  );
}
