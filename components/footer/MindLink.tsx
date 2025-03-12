import React from "react";

export default function MindLink() {
  return (
    <div className="flex sm:justify-between gap-[30px] justify-end">
      <a
        href="https://www.mindnetwork.xyz/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-white"
      >
        Home
      </a>
      <a
        href="https://stats.mindnetwork.xyz/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-white"
      >
        Stats
      </a>
      <a
        href="https://dapp.mindnetwork.xyz/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-white"
      >
        MindV
      </a>
    </div>
  );
}
