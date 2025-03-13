import HubRecord from "@/components/dashboard/HubRecord";
import MyAgent from "@/components/dashboard/MyAgent";
import RewardRule from "@/components/dashboard/RewardRule";

export default function Home() {
  return (
    <div className="px-[var(--layout-sm)] sm:px-[var(--layout-md)]">
      <MyAgent />
      <div className="capitalize underline text-[12px] text-[var(--mind-brand)] text-right mt-[10px]">
        Permanently Shut Down My Agent?
      </div>
      <div className="pb-[200px]">
        <HubRecord />
        <RewardRule />
      </div>
    </div>
  );
}
