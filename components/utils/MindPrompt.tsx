import { Tooltip } from "antd";
import React, { ReactNode } from "react";
import AddPrompt from "@/public/icons/add-prompt.svg";
import { TooltipPlacement } from "antd/es/tooltip";

export default function MindPrompt({
  placement,
  title,
}: {
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
    >
      <AddPrompt className="hover:fill-[var(--mind-brand)]"></AddPrompt>
    </Tooltip>
  );
}
