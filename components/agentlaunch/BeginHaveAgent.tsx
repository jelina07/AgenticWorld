import useAgentGetTokenIdStore from "@/store/useAgentGetTokenId";
import Link from "next/link";
import RequiredHub from "./RequiredHub";
export default function BeginHaveAgent() {
  const agentTokenId = useAgentGetTokenIdStore((state) => state.agentTokenId);
  return (
    <div>
      <div id="launchContent1">Hi, I&apos;m the No.0 CitizenZ</div>
      <div id="launchContent2">
        Congratulation, you have successfully created the No.{agentTokenId} AI
        Agent! You can view more details in{" "}
        <Link
          href="/"
          className="text-white hover:text-white underline hover:underline"
        >
          Dashboard
        </Link>
      </div>
      <div>
        <div>
          <div id="launchContent4">Let's help it train with Basic skills</div>
          <div id="launchContent5">
            Now, choose the first hub below for your agent to join and start
            training the basics from it.
          </div>
        </div>
        <RequiredHub />
      </div>
    </div>
  );
}
