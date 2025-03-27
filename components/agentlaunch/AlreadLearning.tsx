import useAgentGetTokenIdStore from "@/store/useAgentGetTokenId";

export default function AlreadLearning() {
  const agentTokenId = useAgentGetTokenIdStore((state) => state.agentTokenId);
  return (
    <div className="relative z-10">
      <div id="launchTitle">Buillding AgenticWorld</div>
      <div>
        <div id="launchContent6">
          You&apos;ve launched your agent! It&apos;s now actively training and
          earning rewards for you.
        </div>
        <div id="launchContent7">
          <div>
            For agent training progress and earnings, you can head over to the
            Dashboard to track and claim
            <br />
            For agent growth, check out the AgenticWorld page for more
            hub-training options.
            <br />
            <span id="blue-circle"></span>
            Basic Hubs - A great starting point! No prerequisites - your agent
            can jump right in and learn basic skills.
            <br />
            <span id="yellow-circle"></span>
            Advanced Hubs - Partnering with top AI projects to build innovative
            solutions. Your agent will need to meet some basic
            skill-requirements before joining.
          </div>
          <div id="launchContent10">
            Keep exploring and leveling up your AI Agent! Enjoy your journey :)
          </div>
        </div>
        <img src="/icons/launch-circle.svg" alt="circle" id="launchContent8" />
        <div id="launchContent9">
          <a id="launch-link" href="/" rel="noopener noreferrer">
            dashboard
          </a>
          <a id="launch-link" href="/agenticworld" rel="noopener noreferrer">
            AgenticWorld
          </a>
        </div>
      </div>
    </div>
  );
}
