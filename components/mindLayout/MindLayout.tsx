"use client";
import React, { useEffect, useState } from "react";
import Header from "../header";
import Footer from "../footer";
import { useAgentGetTokenId } from "@/sdk";
import useAgentGetTokenIdStore from "@/store/useAgentGetTokenId";
import { notification, Spin } from "antd";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useLov } from "@/store/useLov";
import { useAsyncEffect } from "ahooks";

export default function MindLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading, data, refresh } = useAgentGetTokenId();
  const { setRefreshGetAgentTokenId } = useAgentGetTokenIdStore();
  const { fetchLov, lovs } = useLov();
  const [getLovLoading, setGetLovLoading] = useState(false);

  const searchParams = useSearchParams();
  const pathName = usePathname();
  console.log("pathName", pathName);

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
        description: (() => {
          try {
            const parsedError = JSON.parse(error!);
            return parsedError.name || "Unknown error";
          } catch {
            return error!.toString();
          }
        })(),
      });
      window.history.replaceState({}, "", "/agentlaunch");
    }
  }, [faucetStatus]);

  useAsyncEffect(async () => {
    setGetLovLoading(true);
    await fetchLov();
    setGetLovLoading(false);
  }, []);

  console.log("lovs", lovs);

  return (
    <div>
      <Header />
      {loading || getLovLoading ? (
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
      <div
        className={`w-full p-[8px] bg-[var(--mind-brand)] text-center text-black absolute top-[80px] ${
          pathName === "/airdrop" ? "" : "hidden"
        }`}
      >
        Trade $FHE Now on{" "}
        <a
          href="https://www.gate.io/signup?ch=signupFHE"
          target="_blank"
          rel="noopener noreferrer"
          className="text-black hover:text-black underline hover:underline"
        >
          Gate.io
        </a>
      </div>
    </div>
  );
}
