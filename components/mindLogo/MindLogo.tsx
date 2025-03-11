import Image from "next/image";
import Link from "next/link";

export default function MindLogo() {
  return (
    <div className="h-[70px] flex items-center justify-center">
      <Link href="https://mindnetwork.xyz/" target="_blank">
        <Image
          src="/images/logo.png"
          width={145}
          height={30}
          alt="mind network"
        />
      </Link>
    </div>
  );
}
