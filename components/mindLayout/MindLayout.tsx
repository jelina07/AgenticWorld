"use client";
import React, { useEffect } from "react";
import Header from "../header";
import Footer from "../footer";
import { useAgentGetTokenId } from "@/sdk";
import useAgentGetTokenIdStore from "@/store/useAgentGetTokenId";
import { Spin } from "antd";

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
      {loading ? (
        <div
          className="w-full flex justify-center items-center"
          style={{ height: `calc(100vh - 80px)` }}
        >
          <Spin />
        </div>
      ) : (
        <div>{children}</div>
      )}
      <Footer />
    </div>
  );
}
