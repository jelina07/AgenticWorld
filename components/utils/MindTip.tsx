import { Tooltip } from "antd";
import React, { ReactNode } from "react";
import AddTip from "@/public/icons/add-tip.svg";
import { TooltipPlacement } from "antd/es/tooltip";

export default function MindTip({
  isShow,
  placement,
  title,
}: {
  isShow: boolean;
  placement: TooltipPlacement;
  title: ReactNode;
}) {
  return (
    <Tooltip
      placement={placement}
      title={title}
      arrow={false}
      color="#111d1b"
      className="ml-[5px]"
      //   open={true}
    >
      <div className={isShow ? "" : "hidden"}>
        <AddTip className="hover:fill-[var(--mind-brand)]"></AddTip>
      </div>
    </Tooltip>
  );
}
