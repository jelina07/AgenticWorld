import React from "react";

export default function RulesItem({
  imgurl,
  title,
  info,
}: {
  imgurl: string;
  title: string;
  info: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-[10px] px-[20px] py-[14px]">
        <img src={imgurl} alt="img" />
        <div>
          <div className="text-[15px] font-[700] text-white">{title}</div>
          <div className="text-[12px] text-[var(--mind-grey)]">{info}</div>
        </div>
      </div>
      <hr />
    </div>
  );
}
