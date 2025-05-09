import Link from "next/link";
import React from "react";

export default function AirDropEnd() {
  return (
    <div>
      <div className="mt-[70px]">
        <div
          className="py-[30px] px-[50px] rounded-[8px] bg-[url('/images/check-eligibility-bg.png')]
                  bg-center bg-cover opacity-90"
        >
          <div className="text-[18px] sm:text-[20px] font-[900] capitalize">
            Community Airdrop Claim Period Has Ended
          </div>
          <div className="text-[var(--mind-brand)] text-[12px] mt-[16px] font-[600]">
            Claim Time: April 10th - May 10th
          </div>
          <div className="mt-[27px] text-[14px] font-[600] capitalize leading-6">
            the First airdrop claiming period is now closed. All unclaimed
            tokens have been returned to the community treasury.
          </div>
          <div className="mt-[40px] text-[14px] font-[600] text-center">
            Launch your Agent in AgenticWorld to earn more $FHE
          </div>
          <div className="text-center">
            <Link
              href="/agenticworld"
              style={{
                height: "38px",
                lineHeight: "38px",
                display: "inline-block",
                color: "#00ffb1",
              }}
              className="btn-Link-white-font flex-grow-0 mt-[32px] w-[80%]"
            >
              Go AgenticWorld
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
