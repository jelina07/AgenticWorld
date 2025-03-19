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
  const { loading } = useAgentGetTokenId();

  if (loading) {
    return <div>loading</div>;
  }

  return (
    <div>
      <Header />
      <div>{children}</div>
      <Footer />
    </div>
  );
}
