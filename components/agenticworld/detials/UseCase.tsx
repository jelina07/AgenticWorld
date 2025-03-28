import React from "react";

export default function UseCase({ content }: { content: string }) {
  return (
    <div className="px-[28px] py-[40px] rounded-[20px] bg-[var(--bg-deep-grey)]">
      <div className="text-[18px] font-[600] capitalize">Use Case</div>
      <div className="mt-[15px] text-[12px] leading-[1.1]">
        <div
          dangerouslySetInnerHTML={{
            __html: content || "",
          }}
        />
      </div>
    </div>
  );
}
