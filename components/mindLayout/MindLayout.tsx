"use client";
import React from "react";
import Header from "../header";
import Footer from "../footer";
import { useAgentGetTokenId } from "@/sdk";
import { useAsyncEffect } from "ahooks";

export default function MindLayout({ children }: { children: React.ReactNode }) {
  const { loading, data } = useAgentGetTokenId();
  console.log("🚀 ~ loading:", loading, data);

  return (
    <div>
      <Header />
      <div>{loading ? "loading" : children}</div>
      <Footer />
    </div>
  );
}
