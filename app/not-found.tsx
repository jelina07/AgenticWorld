"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Divider } from "antd";
export default function NotFound() {
  const router = useRouter();
  useEffect(() => {
    router.push("/");
  }, []);
  return (
    <div className="w-full h-[70vh] flex justify-center items-center">
      <div className="flex items-center gap-[20px]">
        <h1 className="text-light text-[32px]">404</h1>
        <Divider
          type="vertical"
          style={{ borderColor: "#eeeeee", height: "50px" }}
        />
        <p className="text-light">This page could not be found.</p>
      </div>
    </div>
  );
}
