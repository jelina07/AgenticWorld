"use client";
import useControlModal from "@/store/useControlModal";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import AccountModal from "../account/accountModal";
import { useGetFheBalance } from "@/sdk";
import useGetFheBalanceStore from "@/store/useGetFheBalanceStore";
export const WalletConnectBtn = () => {
  const { openAccountModal } = useControlModal();
  const { data, refresh, loading } = useGetFheBalance();
  const { balance } = useGetFheBalanceStore();
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
                    className="wallet-btn"
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
                    className="wallet-btn"
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
                    className="wallet-btn"
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
                    className="wallet-btn hidden md:block"
                  >
                    {account.displayName}
                    {account.displayBalance
                      ? ` (${account.displayBalance}, ${
                          !loading ? balance + " FHE" : ""
                        })`
                      : ""}
                  </button>
                  <AccountModal gasBalance={account.displayBalance} />
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
