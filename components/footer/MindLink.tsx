import React from "react";

export default function MindLink() {
  return (
    <div className="flex gap-[30px] justify-between">
      <a
        href="https://www.mindnetwork.xyz/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-white hover:var(--mind-brand)"
      >
        Home
      </a>
      <a
        href="https://stats.mindnetwork.xyz/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-white hover:var(--mind-brand)"
      >
        Stats
      </a>
      {/* <a
        href="https://dapp.mindnetwork.xyz/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-white hover:var(--mind-brand)"
      >
        MindV
      </a> */}
    </div>
  );
}
