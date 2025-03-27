"use client";
import React, { useEffect } from "react";
import Header from "../header";
import Footer from "../footer";
import { useAgentGetTokenId } from "@/sdk";
import useAgentGetTokenIdStore from "@/store/useAgentGetTokenId";
import { notification, Spin } from "antd";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function MindLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading, data, refresh } = useAgentGetTokenId();
  const { setRefreshGetAgentTokenId } = useAgentGetTokenIdStore();

  const searchParams = useSearchParams();
  const pathName = usePathname();
  const faucetStatus = searchParams.get("faucetStatus");
  const error = searchParams.get("error");

  useEffect(() => {
    setRefreshGetAgentTokenId(refresh);
  }, [refresh]);

  useEffect(() => {
    if (faucetStatus === "success") {
      notification.success({
        message: "Success",
        description:
          "Your water collection has entered the queue, please wait for about 5 minutes to refresh your balance ! If you don't receive FHE, please reclaim",
      });
      window.history.replaceState({}, "", pathName);
    } else if (faucetStatus === "error") {
      notification.warning({
        message: "Warning",
        description: JSON.parse(error!).name,
      });
      window.history.replaceState({}, "", pathName);
    }
  }, [faucetStatus]);

  return (
    <div>
      <Header />
      {loading ? (
        <div
          className="w-full flex justify-center items-center"
          style={{ height: `calc(100vh - 160px)` }}
        >
          <Spin />
        </div>
      ) : (
        <div style={{ minHeight: `calc(100vh - 160px)` }}>{children}</div>
      )}
      <Footer />
    </div>
  );
}
