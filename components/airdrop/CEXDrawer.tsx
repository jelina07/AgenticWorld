import { cexInfo } from "@/utils/utils";
import { Drawer, Input, Select } from "antd";
import React, { useState } from "react";
import CEXConfirmModal from "./CEXConfirmModal";

export default function CEXDrawer({ claimAmout }: { claimAmout: any }) {
  const [currentCEX, setCurrentCEX] = useState({
    value: "Bitget",
    label: "Bitget",
    logo: "/icons/bitget-circle-logo.svg",
    img: "/icons/bitget-logo.svg",
    learnMore:
      "https://docs.google.com/document/d/1YkTTWY3tOsnjjcve44tu-jRMyDq2K0ICCMBQsKPt7fs/mobilebasic#heading=h.8qfw0bt1eobs",
    createAccount: "https://bitget.onelink.me/XqvW?af_xp=custom&pid=PRELSTFHE",
  });
  const [isCEXOpen, setIsCEXOpen] = useState(false);
  const showDrawer = async () => {
    if (
      claimAmout?.register?.cexName &&
      claimAmout?.register.cexName !== "MindChain"
    ) {
      const currentCEX = cexInfo.find(
        (item) => item.label === claimAmout.register.cexName
      )!;
      setCurrentCEX(currentCEX);
    }
    setIsCEXOpen(true);
  };
  const onClose = () => {
    setIsCEXOpen(false);
  };
  const handleChange = (value: string) => {
    const cex = cexInfo.find((item) => item.value === value)!;
    setCurrentCEX(cex);
  };
  return (
    <>
      <div
        className="text-[12px] font-[600] text-[var(--mind-brand)] cursor-pointer mt-[10px] text-center"
        onClick={showDrawer}
      >
        Check my submitted info →
      </div>

      <Drawer
        title={
          <div className="text-white">
            <span onClick={onClose} className="cursor-pointer">
              {"<"}
            </span>
            <span className="text-[20px] font-[900] ml-[10px]">
              Pre-Deposit $FHE to CEX with 0 Gas Fee
            </span>
          </div>
        }
        closable={false}
        open={isCEXOpen}
        getContainer={false}
        rootClassName="mind-drawer"
        autoFocus={false}
      >
        <div>
          <div className="pb-[15px] px-[10px] flex justify-between gap-[10px] items-center flex-wrap">
            {cexInfo.map((item) => (
              <div key={item.label}>
                <img src={item.img} alt="cex" className="h-[35px]" />
                {item.label === "Bitget" ? (
                  <div className="text-[9px] text-right text-[#66ddfb] leading-[9px]">
                    50 ~ 1000 $FHE<br></br>1.4M in total, FCFS!
                  </div>
                ) : item.label === "Ourbit" ? (
                  <div className="text-[9px] text-right text-[#5ea976] leading-[9px]">
                    Earn 10% Extra from<br></br>200,000 $FHE Pool
                  </div>
                ) : item.label === "HASHKEY" ? (
                  <div className="text-[9px] text-right text-[#bd5aa0] leading-[9px] mt-[2px]">
                    Earn 100% $FHE bonus<br></br>100K in total,FCFS!
                  </div>
                ) : (
                  <div className="text-[9px] text-right text-[#2d66f6] leading-[9px]">
                    100 ~ 2000 $FHE<br></br>1.5M in total, FCFS!
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center mind-select my-[10px]">
            <span className="font-[600] items-center text-white text-[16px]">
              Select the Exchange
            </span>
            <Select
              prefix={
                <img
                  src={currentCEX.logo}
                  width={20}
                  className="rounded-[50%]"
                />
              }
              defaultValue="Bitget"
              value={currentCEX.value}
              onChange={handleChange}
              options={cexInfo}
              disabled={true}
            />
          </div>
          <a
            href={currentCEX.learnMore}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-[var(--mind-brand)] hover:text-[var(--mind-brand)] hover:underline font-[600] underline text-[12px] ${
              currentCEX.learnMore !== "" ? "" : "hidden"
            }`}
          >
            How to find {currentCEX.label} UID and $FHE deposit address ?
          </a>
          <div className="pl-[30px] pr-[10px] mind-input mt-[30px]">
            <div className="sm:flex items-center">
              <span className="text-[16px] font-[600] text-white inline-block min-w-[150px] sm:mb-[0px] mb-[5px]">
                UID
              </span>
              <Input
                value={claimAmout.register.cexUuid}
                style={{ height: "35px" }}
                disabled={true}
              />
            </div>
            <div className="sm:flex mt-[30px] items-center">
              <span className="text-[16px] font-[600] text-white inline-block min-w-[150px] sm:mb-[0px] mb-[5px]">
                Deposit Address
              </span>
              <Input
                value={claimAmout.register.cexAddress}
                style={{ height: "35px" }}
                disabled={true}
              />
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
}
