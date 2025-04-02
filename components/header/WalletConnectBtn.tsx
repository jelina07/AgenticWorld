"use client";
import useControlModal from "@/store/useControlModal";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import AccountModal from "../account/accountModal";
import { useGetFheBalance } from "@/sdk";
import useGetFheBalanceStore from "@/store/useGetFheBalanceStore";
import { numberDigits } from "@/utils/utils";
import { useAsyncEffect } from "ahooks";
import { useAccount } from "wagmi";
export const WalletConnectBtn = () => {
  const { openAccountModal, accountModalopen } = useControlModal();
  const { runAsync, loading, refresh } = useGetFheBalance();
  const { balance } = useGetFheBalanceStore();
  const { chain: myChain } = useAccount();
  console.log("chainchain", myChain);

  useAsyncEffect(async () => {
    await runAsync();
  }, [accountModalopen]);
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        // openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");
        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    type="button"
                    className="wallet-btn px-[5px] py-[3px] sm:px-[12px] text-[12px] sm:text-[14px]"
                  >
                    Connect Wallet
                  </button>
                );
              }
              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="wallet-btn px-[5px] py-[3px] sm:px-[12px] text-[12px] sm:text-[14px]"
                  >
                    Wrong network
                  </button>
                );
              }
              return (
                <div style={{ display: "flex", gap: 12 }}>
                  <button
                    onClick={openChainModal}
                    style={{ display: "flex", alignItems: "center" }}
                    type="button"
                    className="wallet-btn text-[12px] sm:text-[14px] px-[5px] py-[3px] sm:px-[12px]"
                  >
                    {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 15,
                          height: 15,
                          borderRadius: 999,
                          overflow: "hidden",
                          marginRight: 4,
                        }}
                        className="hidden sm:inline-block"
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? "Chain icon"}
                            src={chain.iconUrl}
                            style={{ width: 15, height: 15 }}
                          />
                        )}
                      </div>
                    )}
                    {chain.name}
                  </button>
                  <button
                    onClick={openAccountModal}
                    type="button"
                    className="wallet-btn px-[5px] py-[3px] sm:px-[12px] text-[12px] sm:text-[14px]"
                  >
                    {account.displayName}
                    <span className="hidden sm:inline-block">
                      {account.displayBalance
                        ? account.displayBalance.includes("e")
                          ? myChain?.nativeCurrency.symbol
                            ? ` (${0 + " " + myChain?.nativeCurrency.symbol}${
                                balance
                                  ? ", " + numberDigits(balance) + " FHE"
                                  : ""
                              })`
                            : ` (${0}${
                                balance
                                  ? ", " + numberDigits(balance) + " FHE"
                                  : ""
                              })`
                          : ` (${account.displayBalance}${
                              balance
                                ? ", " + numberDigits(balance) + " FHE"
                                : ""
                            })`
                        : ""}
                    </span>
                  </button>
                  <AccountModal
                    gasBalance={account.displayBalance}
                    refresh={refresh}
                    loading={loading}
                  />
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
