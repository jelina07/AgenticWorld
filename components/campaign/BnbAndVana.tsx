"use client";
import Link from "next/link";
import { useState } from "react";
import CampaignEnded from "../utils/campaignEnded";
import CampaignCommingSoon from "../utils/campaignCommingSoon";
import CampaignLive from "../utils/campaignLive";

export default function BnbAndVana() {
  return (
    <div className="py-[30px] px-[50px] mt-[60px] rounded-[8px] bg-[url('/images/vhe-claim-bg.png')] bg-contain bg-no-repeat bg-[#070b0a]">
      <div className="flex justify-between items-center">
        <div className="text-[18px] font-[900]">
          World AI Health Hub Campaign
        </div>
      </div>
      <div className="text-[14px] font-[600] mt-[16px]">
        Secure your health data with FHE - World AI Health Hub powered by VANA &
        ZAMA, enables privacy-preserving AI training on encrypted data.
      </div>
      <div className="text-[16px] font-[800] mt-[16px] capitalize">
        15,000,000 ? $FHE for distribution
      </div>
      <div>
        <div className="flex items-center justify-between gap-[5px] sm:w-2/3 flex-wrap rounded-tl-[8px] rounded-tr-[8px] py-[12px] px-[20px] mt-[25px] text-[14px] font-[600] bg-[#283d3a]">
          <span>Phase 1</span>
          <span className="inline-block text-[var(--mind-brand)]">
            10,000,000 $FHE Rewards
          </span>
          <CampaignEnded />
        </div>
        <div className="p-[18px] bg-[#1c1f1f] rounded-bl-[8px] rounded-br-[8px]">
          <div className="flex justify-between items-center">
            <div className="text-[18px] font-[900]">
              <span className="text-[var(--mind-brand)]">Mind Network</span> ×{" "}
              <span className="text-[#DEB03D]">BNB Chain</span>
            </div>
          </div>

          <div className="text-[12px] font-[600] capitalize mt-[8px] text-[var(--mind-brand)]">
            Time: June 5 - June 23, 09:00 AM UTC, 2025
          </div>
          <div className="text-[14px] font-[600] mt-[8px]">
            Deploy your agent to work in World AI Health Hub & Upload your
            Health data on BNB Chain !
          </div>
          <div className="text-right mt-[12px]">
            <Link
              href="/agenticworld/5"
              className="text-[14px] font-[600] text-[var(--mind-brand)] cursor-pointer hover:text-[var(--mind-brand)]"
            >
              Participate →
            </Link>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between gap-[5px] sm:w-2/3 flex-wrap rounded-tl-[8px] rounded-tr-[8px] py-[12px] px-[20px] mt-[25px] text-[14px] font-[600] bg-[#283d3a]">
          <span>Phase 2</span>
          <span className="inline-block mx-[20px] text-[var(--mind-brand)]">
            5,000,000 $FHE Rewards
          </span>
          {/* <CampaignCommingSoon /> */}
          <CampaignLive />
        </div>
        <div className="p-[18px] bg-[#1c1f1f] rounded-bl-[8px] rounded-br-[8px]">
          <div>
            <div className="flex justify-between items-center">
              <div className="text-[18px] font-[900]">
                <span className="text-[var(--mind-brand)]">Mind Network</span> ×{" "}
                <span className="">VANA</span>
              </div>
            </div>

            <div className="text-[12px] font-[600] capitalize mt-[8px] text-[var(--mind-brand)]">
              Time: June 23 - July 23
            </div>
            <div className="text-[14px] font-[600] mt-[8px]">
              Mind Network ignites the DataDAO of World AI Health on VANA,
              powering FHE-encrypted health data storage and unlocking access
              for trusted research pioneers.
            </div>
            <div className="text-[14px] font-[600] mt-[8px]">
              Deploy your agent to work in World AI Health Hub & Upload your
              Health data on <span className="text-[#4141e9]"> VANA Chain</span>{" "}
              !
            </div>
            <div className="text-right mt-[12px]">
              <Link
                href="/agentlaunch"
                className="text-[14px] font-[600] text-[var(--mind-brand)] cursor-pointer hover:text-[var(--mind-brand)]"
              >
                New here? Launch your Agent on{" "}
                <span className="text-[#DEB03D]">BNB Chain</span> fisrt →
              </Link>
              <br />
              <Link
                href="/agenticworld/5"
                className="text-[14px] font-[600] text-[var(--mind-brand)] cursor-pointer hover:text-[var(--mind-brand)]"
              >
                Participate →
              </Link>
            </div>
          </div>

          <div className="mt-[20px]">
            <div className="flex justify-between items-center">
              <div className="text-[18px] font-[900]">
                <span className="text-[var(--mind-brand)]">Mind Network</span> ×{" "}
                <span className="text-[#DEB03D]">BNB Chain</span>
              </div>
            </div>

            <div className="text-[12px] font-[600] capitalize mt-[8px] text-[var(--mind-brand)]">
              Time: June 23 - July 23
            </div>
            <div className="text-[14px] font-[600] mt-[8px]">
              For those who missed out the first Phase of campaign: <br />
              Deploy your agent to work in World AI Health Hub & Upload your
              Health data on BNB Chain !
            </div>
            <div className="text-right mt-[12px]">
              <Link
                href="/agenticworld/5"
                className="text-[14px] font-[600] text-[var(--mind-brand)] cursor-pointer hover:text-[var(--mind-brand)]"
              >
                Participate →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
