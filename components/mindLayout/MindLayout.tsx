"use client";
import React from "react";
import Header from "../header";
import Footer from "../footer";
import { useAgentGetTokenId } from "@/sdk";
import { useAsyncEffect } from "ahooks";

export default function MindLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data, runAsync } = useAgentGetTokenId();

  useAsyncEffect(async () => {
    // await runAsync();
  }, []);

  return (
    <div>
      <Header />
      <div>{children}</div>
      <Footer />
    </div>
  );
}
