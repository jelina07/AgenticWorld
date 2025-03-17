"use client";
import React from "react";
import Header from "../header";
import Footer from "../footer";
import { useAgentGetTokenId } from "@/sdk";

export default function MindLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data } = useAgentGetTokenId();

  return (
    <div>
      <Header />
      <div>{children}</div>
      <Footer />
    </div>
  );
}
