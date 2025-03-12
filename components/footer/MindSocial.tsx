import React from "react";
import Gitbook from "@/public/icons/gitbook.svg";
import Twitter from "@/public/icons/twitter.svg";
import Discord from "@/public/icons/discord.svg";
import More from "@/public/icons/more.svg";

export default function MindSocial() {
  return (
    <div className="w-[170px] flex items-center justify-between">
      <a
        href="https://docs.mindnetwork.xyz/minddocs"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Gitbook
          className="hover:fill-[var(--mind-brand)]"
          height="22"
          width="22"
        />
      </a>
      <a
        href="https://twitter.com/mindnetwork_xyz"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Twitter
          className="hover:fill-[var(--mind-brand)]"
          height="22"
          width="22"
        />
      </a>
      <a
        href="https://discord.com/invite/UYj94MJdGJ"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Discord
          className="hover:fill-[var(--mind-brand)]"
          height="22"
          width="22"
        />
      </a>
      <a
        href="https://mindnetwork.medium.com/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <More
          className="hover:fill-[var(--mind-brand)]"
          height="22"
          width="22"
        />
      </a>
    </div>
  );
}
