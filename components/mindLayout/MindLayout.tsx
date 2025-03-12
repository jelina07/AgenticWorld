import React from "react";
import Header from "../header";
import Footer from "../footer";

export default function MindLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header />
      <div>{children}</div>
      <Footer />
    </div>
  );
}
