import useAgentGetTokenIdStore from "@/store/useAgentGetTokenId";
import StartConfirmModal from "../agenticworld/detials/StartConfirmModal";
import { useMemo, useRef } from "react";
import {
  useHubAgentCount,
  useHubGetCurrent,
  useHubGetCurrentExp,
  useHubList,
} from "@/sdk";
import useGetLearningHubId from "@/store/useGetLearningHubId";
import { useChainModal, useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount, useSwitchChain } from "wagmi";
import Link from "next/link";
import { bnb, bnbtestnet, mindnet, mindtestnet } from "@/sdk/wagimConfig";
import { isDev, isProd } from "@/sdk/utils";

export default function Campaign({ currentSubnet }: { currentSubnet: any }) {
  const { isConnected, chainId } = useAccount();
  const agentTokenId = useAgentGetTokenIdStore((state) => state.agentTokenId);
  const { switchChain } = useSwitchChain();
  const isAgent = agentTokenId !== 0;
  const { data: hubList, loading } = useHubList();

  const ids = useMemo(() => {
    return hubList?.map((item: any) => item.id) || [];
  }, [hubList]);

  const {
    learnSecond,
    loading: learnSecondLoading,
    refresh,
  } = useHubGetCurrentExp({
    tokenId: agentTokenId,
    hubIds: ids,
  });

  const isLearned = useMemo(() => {
    console.log("ids", ids);
    const index = ids.indexOf(5);
    return learnSecond !== undefined && learnSecond[index] > 0;
  }, [learnSecond]);

  console.log("learnSecond", learnSecond, isLearned, isConnected || isLearned);

  return (
    <div className="px-[32px] py-[28px] bg-[var(--bg-deep-grey)] rounded-[20px]">
      <div className="flex justify-between align-bottom">
        <div>
          <div className="flex items-center gap-[20px]">
            <div className="text-[18px] font-[800]">
              World AI Health Campaign on{" "}
              <span className="text-[#e7bb41]">BNB chain</span>
            </div>
            <span
              className={`text-[var(--mind-brand)] text-[12px] px-[6px] py-[4px] border border-[var(--mind-brand)] bg-[#0f1a15] 
                    rounded-[4px] inline-block font-[500]`}
            >
              Upcoming
            </span>
          </div>

          <div className="mt-[12px] font-[600]">
            <div>Time: June 3, 2025 - June 17, 2025.</div>
            <div>
              <span>Rewards: Share in a 10,000 FHE prize pool.</span>
              <a
                href="https://docs.mindnetwork.xyz/minddocs/product/agenticworld/agenticworld-user-guide/world-ai-health-hub"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-[var(--mind-brand)] hover:text-[var(--mind-brand)] hover:underline ml-[10px]"
              >
                Rewards Rule
              </a>
            </div>
          </div>
          <div className="mt-[30px]">
            <div className="font-[700]">
              How to Participate in World AI Health Hub
            </div>
            {chainId === mindnet.id || chainId === mindtestnet.id ? (
              <span
                className="inline-block mt-[15px] text-[var(--mind-brand)] cursor-pointer"
                onClick={() =>
                  switchChain({
                    chainId: isDev() || isProd() ? bnbtestnet.id : bnb.id,
                  })
                }
              >
                click to change network to bnb
              </span>
            ) : !isConnected || isAgent ? (
              <>
                <div
                  className={`px-[12px] py-[16px] rounded-[15px] ${
                    isLearned ? "bg-[#1c2e27]" : "bg-[#212121]"
                  } mt-[12px] flex justify-between gap-[5px]`}
                >
                  <span className="text-[var(--mind-brand)] flex-shrink-0">
                    Task 1
                  </span>
                  <span className="ml-[10px]">
                    Click the Start Working button to let your agent work in
                    World AI Health Hub.
                    {isLearned ? " ✅" : ""}
                  </span>
                  <img
                    src="/icons/refresh.svg"
                    alt="refresh"
                    onClick={refresh}
                    width={15}
                    className={`cursor-pointer ${
                      learnSecondLoading ? "refresh" : ""
                    } ${!isConnected || isLearned ? "hidden" : ""} `}
                  />
                </div>
                <div className="px-[12px] py-[16px] rounded-[15px] bg-[#212121] mt-[12px]">
                  <span className="text-[var(--mind-brand)]">Task 2</span>
                  <span className="ml-[10px]">
                    Upload your Health Data with FHE. (Coming Soon)
                  </span>
                </div>
              </>
            ) : (
              <Link
                href="/agentlaunch"
                className="inline-block mt-[15px] text-[var(--mind-brand)] hover:text-[var(--mind-brand)] underline"
              >
                Go to create a agent first !
              </Link>
            )}
            {/* {!isConnected || isAgent ? (
              <>
                <div
                  className={`px-[12px] py-[16px] rounded-[15px] ${
                    isLearned ? "bg-[#1c2e27]" : "bg-[#212121]"
                  } mt-[12px] flex justify-between gap-[5px]`}
                >
                  <span className="text-[var(--mind-brand)] flex-shrink-0">
                    Task 1
                  </span>
                  <span className="ml-[10px]">
                    Click the Start Working button to let your agent work in
                    World AI Health Hub.
                    {isLearned ? " ✅" : ""}
                  </span>
                  <img
                    src="/icons/refresh.svg"
                    alt="refresh"
                    onClick={refresh}
                    width={15}
                    className={`cursor-pointer ${
                      learnSecondLoading ? "refresh" : ""
                    } ${!isConnected || isLearned ? "hidden" : ""} `}
                  />
                </div>
                <div className="px-[12px] py-[16px] rounded-[15px] bg-[#212121] mt-[12px]">
                  <span className="text-[var(--mind-brand)]">Task 2</span>
                  <span className="ml-[10px]">
                    Upload your Health Data with FHE. (Coming Soon)
                  </span>
                </div>
              </>
            ) : (
              <>
                {chainId === mindnet.id || chainId === mindtestnet.id ? (
                  <span
                    className="inline-block mt-[15px] text-[var(--mind-brand)] cursor-pointer"
                    onClick={() =>
                      switchChain({
                        chainId: isDev() || isProd() ? bnbtestnet.id : bnb.id,
                      })
                    }
                  >
                    click to change network to bnb
                  </span>
                ) : (
                  <Link
                    href="/agentlaunch"
                    className="inline-block mt-[15px] text-[var(--mind-brand)] hover:text-[var(--mind-brand)] underline"
                  >
                    Go to create a agent first !
                  </Link>
                )}
              </>
            )} */}
          </div>
        </div>
        <img
          src="/icons/worldAiHealthImg.svg"
          alt="worldAiHealthImg"
          className="relative bottom-[-28px] hidden sm:inline-block"
        />
      </div>
    </div>
  );
}
