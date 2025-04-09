import { create } from "zustand";

// control accountModal
type ControlModalType = {
  //account modal
  accountModalopen: boolean;
  setIsAccountModalopen: (isAccountModalopen: boolean) => void;
  openAccountModal: () => void;
  //airdrop success modal
  airdropSuccessModalopen: boolean;
  setIsAirdropSuccessModalopen: (isAccountModalopen: boolean) => void;
  openAirdropSuccessModal: () => void;
};

const useControlModal = create<ControlModalType>((set, get) => ({
  //account modal
  accountModalopen: false,
  setIsAccountModalopen: (isAccountModalopen: boolean) => {
    set({ accountModalopen: isAccountModalopen });
  },
  openAccountModal: () => {
    set({ accountModalopen: true });
  },

  //airdrop success modal
  airdropSuccessModalopen: false,
  setIsAirdropSuccessModalopen: (isAirdropSuccessModalopen: boolean) => {
    set({ airdropSuccessModalopen: isAirdropSuccessModalopen });
  },
  openAirdropSuccessModal: () => {
    set({ airdropSuccessModalopen: true });
  },
}));

export default useControlModal;
