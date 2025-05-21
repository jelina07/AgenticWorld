import { useFHETokenIntoWallet } from "@/sdk";

export default function AddFHE() {
  const { run: importFHE, loading: importLoading } = useFHETokenIntoWallet();

  return (
    <div>
      {importLoading ? (
        <span className="text-[var(--mind-brand)] text-[14px] cursor-pointer">
          Loading...
        </span>
      ) : (
        <span
          className="text-[var(--mind-brand)] text-[14px] cursor-pointer"
          onClick={importFHE}
        >
          Add FHE to wallet
        </span>
      )}
    </div>
  );
}
