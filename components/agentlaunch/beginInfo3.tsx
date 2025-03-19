"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Typewriter from "typewriter-effect";
import StakeLaunch from "./StakeLaunch";
import RequiredHub from "./RequiredHub";
import { useRouter } from "next/navigation";
import useAgentGetTokenIdStore from "@/store/useAgentGetTokenId";
import { useHubGetCurrent, useHubList } from "@/sdk";
import useGetLearningHubId from "@/store/useGetLearningHubId";
import { usePrevious } from "ahooks";
const string1 = `  
    <div>
      <div>
        <div id="launchContent1">Hi, I&apos;m the No.0 CitizenZ</div>
        <br />
        <div id="launchContent2">
          I&apos;m here to shape the Agentic World with you together. Ready to begin
          the journey?
          <br />
          <br />
          As the journey begin, we&apos; ll gonna launch your own AI Agent together!
          You&apos;ll just need some $FHE tokens to launch (minimum of 100). Don&apos;t
          worry — you&apos;re always in control. You can withdraw your tokens anytime,
          no lock-ups involved.
          <br />
          <br />
          Once your agent is launch, send your agent on adventures across
          various hubs to gain new skills and increase its potential. The
          smarter your agent becomes, the more it contributes to the network—and
          the more rewards you&apos;ll earn!
        </div>
      </div>
    </div>`;

const string2 = `
      <div>
        <div id="launchContent3">
          Well Done! You&apos;ve successfully set up your AI Agent!
        </div>
        <div id="launchContent4">Let's help it learn with Basic skills</div>
        <div id="launchContent5">
          Now, choose the first hub below for your agent to join and start
          learning the basics from it.
        </div>
      </div>`;
const string3 = ` 
      <div>
        <div id="launchContent6">
          Congrats! Now your agent starts learning and earning rewards for you
        </div>
        <div id="launchContent7">
          <div>
            For agent learning progress and earnings, you can head over to the
            Dashboard to track and claim
            <br />
            For agent growth, check out the Agentic World page for more
            hub-learning options.
            <br />
            <span id="blue-circle"></span>
            Basic Hubs - A great starting point! No prerequisites—your agent can
            jump right in and learn basic skills.
            <br />
            <span id="yellow-circle"></span>
            Advanced Hubs - Partnering with top AI projects to build innovative
            solutions. Your agent will need to meet some basic
            skill-requirements before joining.
            <br />
            <br />
            <br />
            Keep exploring and leveling up your AI Agent! Enjoy your journey :)
          </div>
        </div>
      </div>`;
const BeginInfo3 = () => {
  const router = useRouter();
  const agentTokenId = useAgentGetTokenIdStore((state) => state.agentTokenId);
  const preTokenId = useRef<number>(agentTokenId);
  console.log("🚀 ~ BeginInfo3 ~ agentTokenId:", agentTokenId, preTokenId);
  if (preTokenId.current) {
    router.replace("/");
  }

  const [stringtypedout1, setStringtypedout1] = useState(false);
  const [stringtypedout2, setStringtypedout2] = useState(false);
  const [stringtypedout3, setStringtypedout3] = useState(false);
  const stakeLaunchRef: any = useRef(null);

  const isAgent = agentTokenId !== 0;

  const { data: subnetList } = useHubList({
    cacheKey: "useSubnetList",
    staleTime: 5 * 60 * 1000,
  });

  const learningId = useGetLearningHubId((state) => state.learningHubId);

  const isLearnBasicHub = useMemo(() => {
    if (learningId && Array.isArray(subnetList)) {
      return subnetList
        .filter((item: any) => item.type === 0)
        .map((obj: any) => obj.id)
        .includes(learningId);
    }
    return false;
  }, [learningId, subnetList]);

  console.log("isLearnBasicHub", learningId, isLearnBasicHub);

  return (
    <div className="mt-[30px] sm:mt-[70px]">
      <div id="launchTitle">Buillding Agentic World</div>
      <Typewriter
        options={{
          loop: false,
          cursor: "",
          delay: 10,
        }}
        onInit={(typewriter) => {
          typewriter
            .typeString(string1)
            .start()
            .callFunction(() => {
              setStringtypedout1(true);
            });
        }}
      />
      <div
        className={`${
          stringtypedout1 ? "visible-style" : "hidden-style"
        } mt-[50px]`}
      >
        <StakeLaunch ref={stakeLaunchRef} />
      </div>

      {isAgent && stringtypedout1 ? (
        <Typewriter
          options={{
            loop: false,
            cursor: "",
            delay: 10,
          }}
          onInit={(typewriter) => {
            stakeLaunchRef.current?.clearStakeAmount();
            typewriter
              .typeString(string2)
              .start()
              .callFunction(() => {
                setStringtypedout2(true);
              });
          }}
        />
      ) : (
        <></>
      )}

      <div
        className={`${
          stringtypedout2 ? "visible-style" : "hidden-style"
        } mt-[40px]`}
      >
        <RequiredHub />
      </div>
      {isLearnBasicHub ? (
        <Typewriter
          options={{
            loop: false,
            cursor: "",
            delay: 30,
          }}
          onInit={(typewriter) => {
            typewriter
              .typeString(string3)
              .start()
              .callFunction(() => {
                setStringtypedout3(true);
              });
          }}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default BeginInfo3;
