"use client";
import React from "react";
import { useTypewriter } from "react-typewriter-plus";

const htmlContent = `<div id="title">
          Buillding Agentic World
        </div>`;

export default function beginInfo() {
  const animatedText = useTypewriter(htmlContent, {
    speed: 50,
    type: "html",
    cursor: false,
  });
  return (
    // <div>
    //   <div>
    //     <div
    //       id="launchTitle"
    //       className="text-[30px] sm:text-[40px] font-[900] capitalize text-center relative z-[10]"
    //     >
    //       Buillding Agentic World
    //     </div>
    //     {/* <div className="text-[20px] font-[600] capitalize text-center mt-[15px]">
    //       [Start exploring]
    //     </div> */}
    //   </div>

    //   <div>
    //     <div className="text-[20px] sm:text-[26px] font-[700] mt-[40px]">
    //       Hi, I'm the No.0 CitizenZ
    //     </div>
    //     <div className="text-[12px] sm:text-[16px] mt-[10px]">
    //       I'm here to shape the Agentic World with you together. Ready to begin
    //       the journey?
    //     </div>
    //     <div className="text-[12px] sm:text-[16px] mt-[20px]">
    //       As the journey begin, we'll gonna launch your own AI Agent together!
    //       You'll just need some $FHE tokens to launch (minimum of 100). Don't
    //       worry—you're always in control. You can withdraw your tokens anytime,
    //       no lock-ups involved.
    //     </div>
    //     <div className="text-[12px] sm:text-[16px] mt-[20px]">
    //       Once your agent is launch, send your agent on adventures across
    //       various hubs to gain new skills and increase its potential. The
    //       smarter your agent becomes, the more it contributes to the network—and
    //       the more rewards you'll earn!
    //     </div>
    //   </div>
    // </div>
    <div>
      <div id="launchTitle">Buillding Agentic World</div>
      <div>
        <div id="launchContent1">Hi, I&apos;m the No.0 CitizenZ</div>
        <br />
        <div id="launchContent2">
          I&apos;m here to shape the Agentic World with you together. Ready to
          begin the journey?
          <br />
          <br />
          As the journey begin, we&apos;ll gonna launch your own AI Agent
          together! You&apos;ll just need some $FHE tokens to launch (minimum of
          100). Don&apos;t worry—you&apos;re always in control. You can withdraw
          your tokens anytime, no lock-ups involved.
          <br />
          <br />
          Once your agent is launch, send your agent on adventures across
          various hubs to gain new skills and increase its potential. The
          smarter your agent becomes, the more it contributes to the network—and
          the more rewards you&apos;ll earn!
        </div>
      </div>
    </div>
  );
}
