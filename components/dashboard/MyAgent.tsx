"use client";
import { Button, Input } from "antd";
import Lock from "@/components/utils/Lock";
import UnLock from "@/components/utils/UnLock";
import Edit from "@/public/icons/edit.svg";
import Link from "next/link";
import LaunchAgent from "./LaunchAgent";
import { useState } from "react";

export default function MyAgent() {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState("CitizenZ_0");

  const editName = () => {
    setIsEditing(true);
  };

  const handleInputBlur = (event: any) => {
    setText(event.target.value);
    setIsEditing(false);
  };
  const isAgent = false;
  return (
    <div
      className="p-[35px] bg-[url('/images/my-agent-bg.png')] bg-center bg-cover mt-[80px] 
                    lg:flex items-center justify-between gap-[20px]"
    >
      <div className="bg-[url('/icons/portrait.svg')] w-[180px] h-[180px] bg-contain bg-no-repeat mb-[50px] lg:mb-[0px] ">
        <img
          src="/icons/cz.svg"
          alt="cz"
          width="150"
          className="mx-auto pt-[30px]"
        />
        <div className={`${!isAgent ? "hidden" : ""}`}>
          <Button
            type="primary"
            className={`button-white-border-white-font mt-[10px]`}
          >
            Update
          </Button>
        </div>
      </div>
      <div className={`mind-input flex-1`}>
        {isAgent ? (
          <div>
            <div className="font-[800]">My Agent</div>
            <div>
              <div
                className=" px-[11px] py-[4px] mt-[15px] h-[70px] flex items-center
                          bg-[#181818] rounded-[10px] border-[length:var(--border-width)] border-[var(--btn-border)]"
              >
                <div className="flex-1 flex justify-between items-center">
                  <span className="text-[var(--mind-grey)] text-[14px]">
                    Name
                  </span>
                  <div className="flex items-center gap-[5px]">
                    {isEditing ? (
                      <input
                        type="text"
                        defaultValue={text}
                        onBlur={handleInputBlur}
                        autoFocus
                        style={{
                          fontSize: "14px",
                          padding: "5px",
                          color: "black",
                        }}
                      />
                    ) : (
                      <span className="text-[14px]">{text}</span>
                    )}
                    <div className="cursor-pointer" onClick={editName}>
                      <Edit />
                    </div>
                  </div>
                </div>
              </div>
              <div
                className=" px-[11px] py-[4px] mt-[15px] h-[70px] flex items-center
                            bg-[#181818] rounded-[10px] border-[length:var(--border-width)] border-[var(--btn-border)]"
              >
                <div className="flex-1 flex justify-between items-center">
                  <span className="text-[var(--mind-grey)] text-[14px]">
                    Hub Learned
                  </span>
                  <span className="text-[30px] text-light-shadow">2</span>
                </div>
              </div>
              <div className="mt-[15px] flex gap-[14px] flex-col md:flex-row">
                <div className="rounded-[8px] flex-1 border-[length:var(--border-width)] border-[var(--mind-brand)] p-[11px]">
                  <div className="text-[14px] text-[var(--mind-grey)] my-auto">
                    Status
                  </div>
                  <div className="flex gap-[10px] mt-[20px] h-[45px] items-center">
                    <Lock />
                    <UnLock />
                  </div>
                  <div className="mt-[40px]">
                    <Link href="/agenticworld" className="btn-Link-white-font">
                      Explore New Skills
                    </Link>
                  </div>
                </div>
                <div className="rounded-[8px] flex-1 border-[length:var(--border-width)] border-[var(--mind-brand)] p-[11px]">
                  <div className="text-[14px] text-[var(--mind-grey)] whitespace-nowrap">
                    Stake
                  </div>
                  <div className="mt-[20px] align-bottom h-[45px]">
                    <span className="text-[30px] text-light-shadow">0.8</span>
                    <span className="text-[12px] text-[var(--mind-brand)]">
                      {" "}
                      FHE
                    </span>
                  </div>
                  <div className="mt-[40px] flex justify-between gap-[7px]">
                    <Button
                      type="primary"
                      className="button-brand-border-white-font"
                    >
                      Increase
                    </Button>
                    <Button
                      type="primary"
                      className="button-brand-border-white-font"
                    >
                      Decrease
                    </Button>
                  </div>
                </div>
                <div className="rounded-[8px] flex-1 border-[length:var(--border-width)] border-[var(--mind-brand)] p-[11px]">
                  <div className="text-[14px] text-[var(--mind-grey)] whitespace-nowrap">
                    Total Rewards
                  </div>
                  <div className="mt-[20px] align-bottom h-[45px]">
                    <span className="text-[30px] text-light-shadow">0.8</span>
                    <span className="text-[12px] text-[var(--mind-brand)]">
                      {" "}
                      FHE
                    </span>
                  </div>
                  <div className="mt-[40px]">
                    <Button
                      type="primary"
                      className="button-brand-border-white-font"
                    >
                      Redeem
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <LaunchAgent />
        )}
      </div>
    </div>
  );
}
