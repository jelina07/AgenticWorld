import LockLogo from "@/public/icons/lock.svg";

export default function Lock() {
  return (
    <div className="flex items-center px-[10px] rounded-[4px] bg-[#1D1D1D] gap-[10px] w-[90px] h-[24px] border border-[#484848]">
      <LockLogo />
      <span className="text-[12px]">lock</span>
    </div>
  );
}
