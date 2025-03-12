import UnLockLogo from "@/public/icons/unlock.svg";

export default function UnLock() {
  return (
    <div className="flex items-center px-[10px] py-[5px] rounded-[4px] bg-[#1D1D1D] gap-[10px] w-[90px] h-[24px] border border-[#484848]">
      <UnLockLogo />
      <span className="text-[12px]">Unlock</span>
    </div>
  );
}
