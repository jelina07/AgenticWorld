import useAgentGetTokenIdStore from "@/store/useAgentGetTokenId";
import { useMemo, useRef } from "react";
import {
  useAgentGetBnbTokenId,
  useHubGetBnbCurrentExp,
  useHubGetCurrentExp,
  useHubList,
  useIsVoted,
  useVanaHasSend,
} from "@/sdk";
import { useAccount, useSwitchChain } from "wagmi";
import Link from "next/link";
import { bnb, bnbtestnet, mindnet, mindtestnet } from "@/sdk/wagimConfig";
import { isDev, isProd } from "@/sdk/utils";
import useHubLearningTime from "@/store/useHubLearningTime";
import { useChainModal } from "@rainbow-me/rainbowkit";

export default function Campaign() {
  const { isConnected, chainId, chain } = useAccount();
  console.log("chain", chain);
  const { openChainModal } = useChainModal();
  const { hubLearningTime, refreshGetHubLearningTime } = useHubLearningTime();
  const { data: bnbAgentTokenId } = useAgentGetBnbTokenId();
  const isAgent = bnbAgentTokenId !== 0;
  const { data: hubList } = useHubList();
  const ids = useMemo(() => {
    return hubList?.map((item: any) => item.id) || [];
  }, [hubList]);
  const {
    learnSecond,
    loading: learnSecondLoading,
    refresh,
  } = useHubGetBnbCurrentExp({
    tokenId: bnbAgentTokenId,
    hubIds: ids,
  });

  const isLearned = useMemo(() => {
    const index = ids.indexOf(5);
    return learnSecond !== undefined && learnSecond[index] > 0;
  }, [learnSecond]);

  const {
    data: isVoted,
    refresh: refreshVoted,
    loading: isVotedLoading,
  } = useIsVoted();
  const {
    data: isVanaSend,
    refresh: isVanaSendRefresh,
    loading: isVanaSendLoading,
  } = useVanaHasSend();

  const refreshTask2 = () => {
    refreshVoted();
    isVanaSendRefresh();
  };

  console.log("isAgent", bnbAgentTokenId, isAgent);
  console.log("isVoted", isVoted);

  return (
    <div className="px-[32px] py-[28px] bg-[var(--bg-deep-grey)] rounded-[20px]">
      <div className="flex justify-between align-bottom">
        <div>
          <div className="flex items-center gap-[20px]">
            <div className="text-[18px] font-[800]">
              World AI Health Campaign on{" "}
              <span className="text-[#e7bb41]">BNB chain</span> and{" "}
              <span className="text-[#4141e9]">VANA chain</span>
            </div>
          </div>

          <div className="mt-[12px] font-[600]">
            <div>Time: June 23 - July 23</div>
            <div>
              <span>Rewards: Share in a 5,000,000 FHE prize pool.</span>
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
            {chainId === mindnet.id ||
            chainId === mindtestnet.id ||
            (!chain && isConnected) ? (
              <span
                className="inline-block mt-[15px] text-[var(--mind-brand)] cursor-pointer"
                onClick={() => openChainModal?.()}
              >
                click to change network to BNB chain or VANA chain
              </span>
            ) : (chainId === bnb.id || chainId === bnbtestnet.id) &&
              !isAgent ? (
              <Link
                href="/agentlaunch"
                className="inline-block mt-[15px] text-[var(--mind-brand)] hover:text-[var(--mind-brand)] underline"
              >
                Launch your Agent fisrt →
              </Link>
            ) : !isAgent ? (
              <Link
                href="/agentlaunch"
                className="inline-block mt-[15px] text-[var(--mind-brand)] hover:text-[var(--mind-brand)] underline"
              >
                You are currently on {chain?.name} chain, Please Launch your
                Agent on <span className="text-[#DEB03D]">BNB Chain</span> fisrt
                →
              </Link>
            ) : !isConnected || isAgent ? (
              <>
                <div
                  className={`px-[12px] py-[16px] rounded-[15px] ${
                    isLearned ? "bg-[#1c2e27]" : "bg-[#212121]"
                  } mt-[12px] flex justify-between gap-[5px]`}
                >
                  <div>
                    <span className="text-[var(--mind-brand)] flex-shrink-0">
                      Task 1
                    </span>
                    <span className="ml-[10px]">
                      Click the "Start Working" button on bnb chain to let your
                      agent work in World AI Health Hub.
                      {isLearned ? " ✅" : ""}
                    </span>
                  </div>
                  <img
                    src="/icons/refresh.svg"
                    alt="refresh"
                    onClick={() => refresh()}
                    width={15}
                    className={`cursor-pointer ${
                      learnSecondLoading ? "refresh" : ""
                    } ${!isConnected || isLearned ? "hidden" : ""} `}
                  />
                </div>
                <div
                  className={`px-[12px] py-[16px] rounded-[15px] mt-[12px] ${
                    isVoted || isVanaSend ? "bg-[#1c2e27]" : "bg-[#212121]"
                  } mt-[12px] flex justify-between gap-[5px]`}
                >
                  <div>
                    <span className="text-[var(--mind-brand)]">Task 2</span>
                    <span className="ml-[10px]">
                      Upload your Health Data with FHE.
                      {isVoted || isVanaSend ? " ✅" : ""}
                    </span>
                  </div>
                  <img
                    src="/icons/refresh.svg"
                    alt="refresh"
                    onClick={refreshTask2}
                    width={15}
                    className={`cursor-pointer ${
                      isVotedLoading || isVanaSendLoading ? "refresh" : ""
                    } ${
                      !isConnected || isVoted || isVanaSend ? "hidden" : ""
                    } `}
                  />
                </div>
              </>
            ) : (
              <></>
            )}
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
