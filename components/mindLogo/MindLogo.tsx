import Image from "next/image";
import Link from "next/link";

export default function MindLogo() {
  return (
    <div className="h-[50px] flex items-center justify-center">
      <Link href="https://mindnetwork.xyz/" target="_blank">
        <img
          src="/images/logo.png"
          height={30}
          alt="mind network"
          className="w-[100px] sm:w-[140px]"
        />
      </Link>
    </div>
  );
}
