import Link from "next/link";
import React from "react";

export default function LaunchAgent() {
  return (
    <div>
      <div className="font-[800]">My Agent</div>
      <div className="mt-[40px]">
        <Link href="/agenticworld" className="btn-Link-brand-font">
          Launch Your First AI Agent
        </Link>
      </div>
    </div>
  );
}
