import React from "react";

export default function RulesItem({
  linkurl,
  imgurl,
  title,
  info,
}: {
  linkurl: string;
  imgurl: string;
  title: string;
  info: string;
}) {
  return (
    <div>
      <a
        href={linkurl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-[10px] px-[20px] py-[14px] cursor-pointer "
      >
        <img src={imgurl} alt="img" />
        <div>
          <div className="text-[15px] font-[700] text-white">{title}</div>
          <div className="text-[12px] text-[var(--mind-grey)]">{info}</div>
        </div>
      </a>
      <hr />
    </div>
  );
}
