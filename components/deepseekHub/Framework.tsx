import { Image } from "antd";

export default function Framework({ currentSubnet }: { currentSubnet: any }) {
  const morInfoArray =
    currentSubnet?.moreInfo !== "" &&
    currentSubnet?.moreInfo?.split(",").map((item: string) => {
      const [type, link] = item?.split("#");
      return {
        type: type?.trim(),
        link: link?.trim(),
      };
    });

  return (
    <div className="mt-[25px]">
      <div className="px-[28px] py-[26px] bg-[#181818] rounded-[20px]">
        <Image
          className="w-full mt-[10px]"
          src="/images/deepseek-framework.png"
        />
        <div className="text-right">
          <a
            href="https://explorer.mindnetwork.xyz/address/0x6cA48342b70ea382Ab9FCdf7C0E4073eA10850C6"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12px] font-[600] text-[var(--mind-brand)] underline hover:text-[var(--mind-brand)] hover:underline"
          >
            View latest voting transactions on-chain
          </a>
        </div>
      </div>
      <div className="mt-[30px]">
        <div className="font-[700]">
          Why need model-verification, why{" "}
          <span className="text-[var(--mind-brand)]">FHE</span> ?
        </div>
        <div className="text-[14px] text-[#888E8D] mt-[10px] leading-[1.1]">
          <div>
            AI agents can give inaccurate or misleading response — especially
            when the model has been tampered with or pre-tuned in unauthorized
            ways — all without the user ever knowing. This poses a serious
            threat to AI trust, transparency, and safety, especially as these
            models are increasingly used to inform decisions and shape
            narratives.
          </div>
          <div>
            <span className="text-[var(--mind-brand)]">→</span> To tackle this,
            we need rigorous model verification to ensure responses originate
            from the genuine AI model (e.g. DeepSeek R1), not a modified or fake
            one.
          </div>
          <div>
            <span className="text-[var(--mind-brand)]">→</span> FHE makes
            verification secure and trustworthy — allows nodes vote securely
            without data-reveal, keeping the process private, tamper-proof, and
            reliable.
          </div>
          <div>
            This combination guarantees the privacy, accuracy, and reliability
            of your AI interactions, eliminating hallucinations and building
            trust.
          </div>
        </div>
      </div>
      <div
        className={`mt-[25px] ${
          currentSubnet?.moreInfo && currentSubnet?.moreInfo !== ""
            ? ""
            : "hidden"
        }`}
      >
        <div className="text-[14px] font-[600]">More Information:</div>
        <div className="flex gap-[5px]">
          {morInfoArray?.map((item: any, index: number) => (
            <div key={index}>
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--mind-brand)] text-[14px] underline hover:underline hover:text-[var(--mind-brand)]"
              >
                {item.type}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
