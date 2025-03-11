import React from "react";
import Header from "../header";

export default function MindLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="px-[15px] md:px-[30px]">
      <Header></Header>
      <div>{children}</div>
    </div>
  );
}
