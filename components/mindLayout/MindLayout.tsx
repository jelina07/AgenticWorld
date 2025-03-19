"use client";
import React, { useEffect } from "react";
import Header from "../header";
import Footer from "../footer";
import { useAgentGetTokenId } from "@/sdk";
import useAgentGetTokenIdStore from "@/store/useAgentGetTokenId";

export default function MindLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading, data, refresh } = useAgentGetTokenId();
  const { setRefreshGetAgentTokenId } = useAgentGetTokenIdStore();

  useEffect(() => {
    setRefreshGetAgentTokenId(refresh);
  }, [refresh]);

  console.log("🚀 ~ loading:", loading, data);

  return (
    <div>
      <Header />
      <div>{loading ? "loading" : children}</div>
      <Footer />
    </div>
  );
}
