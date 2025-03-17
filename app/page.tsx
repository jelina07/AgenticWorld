import HubRecord from "@/components/dashboard/HubRecord";
import MyAgent from "@/components/dashboard/MyAgent";
import RewardRule from "@/components/dashboard/RewardRule";
import ShutDownAgent from "@/components/dashboard/ShutDownAgent";

export default function Home() {
  return (
    <div className=" sm:px-[var(--layout-md)]">
      <MyAgent />
      <ShutDownAgent />
      <div className="pb-[200px]">
        <HubRecord />
        <RewardRule />
      </div>
    </div>
  );
}
