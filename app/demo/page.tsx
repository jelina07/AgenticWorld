"use client";
import { useAirdropCexRegister } from "@/sdk";

export default function Page() {
  const { runAsync } = useAirdropCexRegister();

  const register = async () => {
    const res = await runAsync?.({ cexName: "bitget", cexAddress: "abcdef", cexUuid: "123123123" });
  };

  return (
    <div>
      <button onClick={register}>register</button>
    </div>
  );
}
