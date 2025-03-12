import { Button, Input } from "antd";
import Lock from "@/components/utils/Lock";
import UnLock from "@/components/utils/UnLock";
import Link from "next/link";

export default function MyAgent() {
  const isAgent = false;
  return (
    <div className="p-[35px] bg-[url('/images/my-agent-bg.png')] bg-center bg-cover mt-[80px] flex items-center justify-between gap-[20px]">
      <div className="bg-[url('/icons/portrait.svg')] w-[180px] h-[180px] bg-contain bg-no-repeat">
        <img
          src="/icons/cz.svg"
          alt="cz"
          width="150"
          className="mx-auto pt-[30px]"
        />
      </div>
      <div className={`mind-input flex-1`}>
        {isAgent ? (
          <div>
            <div className="font-[800]">My Agent</div>
            <div>
              <Input
                placeholder="Name"
                style={{ height: "70px", marginTop: "30px" }}
              />
              <Input
                placeholder="Hub Learned"
                style={{ height: "70px", marginTop: "15px" }}
              />
              <div className="mt-[15px] flex gap-[14px]">
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
                  <div className="text-[14px] text-[var(--mind-grey)]">
                    Total Rewards
                  </div>
                  <div className="mt-[20px] align-bottom h-[45px]">
                    <span className="text-[30px] text-light-shadow">0.8</span>
                    <span className="text-[12px]"> FHE</span>
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
                  <div className="text-[14px] text-[var(--mind-grey)]">
                    Total Rewards
                  </div>
                  <div className="mt-[20px] align-bottom h-[45px]">
                    <span className="text-[30px] text-light-shadow">0.8</span>
                    <span className="text-[12px]"> FHE</span>
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
          <div className="w-[70%] mx-auto">
            <div className="font-[800]">My Agent</div>
            <div className="mt-[40px]">
              <Link href="/agentlaunch" className="btn-Link-brand-font">
                Launch Your First AI Agent
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
