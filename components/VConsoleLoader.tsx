"use client";

import { useEffect } from "react";
import { isMainnetio } from "@/sdk/utils";

export default function VConsoleLoader() {
  useEffect(() => {
    if (isMainnetio()) {
      import("vconsole").then(({ default: VConsole }) => {
        new VConsole();
      });
    }
  }, []);

  return null;
}
