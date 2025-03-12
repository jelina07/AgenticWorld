import MyAgent from "@/components/dashboard/MyAgent";
import { Input } from "antd";

export default function Home() {
  return (
    <div className="px-[var(--layout-sm)] sm:px-[var(--layout-md)]">
      <MyAgent />
      <div className="capitalize underline text-[12px] text-[var(--mind-brand)] text-right mt-[10px]">
        Permanently Shut Down My Agent?
      </div>
    </div>
  );
}
