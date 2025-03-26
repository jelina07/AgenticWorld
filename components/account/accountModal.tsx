import useControlModal from "@/store/useControlModal";
import { Button, Modal, Tabs, TabsProps } from "antd";
import AccountWallet from "./AccountWallet";
import { useDisconnect } from "wagmi";
import Transaction from "./Transaction";

export default function AccountModal({
  gasBalance,
  refresh,
  loading,
}: {
  refresh: Function;
  loading: boolean;
  gasBalance?: string;
}) {
  const { accountModalopen, setIsAccountModalopen } = useControlModal();
  const { disconnect } = useDisconnect();
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Wallet",
      children: (
        <AccountWallet
          gasBalance={gasBalance}
          refresh={refresh}
          loading={loading}
        />
      ),
    },
    {
      key: "2",
      label: "Transactions",
      children: <Transaction />,
    },
  ];
  const handleCancel = () => {
    setIsAccountModalopen(false);
  };
  const onChange = (key: string) => {
    console.log(key);
  };

  const disconnectWallet = () => {
    disconnect();
    handleCancel();
  };

  return (
    <Modal
      title="Your Wallet"
      open={accountModalopen}
      onCancel={handleCancel}
      className="mind-madal mind-tab"
      footer={null}
    >
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
      <Button
        type="primary"
        className="button-brand-border-white-font mt-[20px]"
        onClick={() => disconnectWallet()}
      >
        Disconnect Wallet
      </Button>
    </Modal>
  );
}
