import { create } from "zustand";

// control accountModal
type ControlModalType = {
  //account modal
  accountModalopen: boolean;
  setIsAccountModalopen: (isAccountModalopen: boolean) => void;
  openAccountModal: () => void;
};

const useControlModal = create<ControlModalType>((set, get) => ({
  //account modal
  accountModalopen: false,
  setIsAccountModalopen: async (isAccountModalopen: boolean) => {
    set({ accountModalopen: isAccountModalopen });
  },
  openAccountModal: async () => {
    set({ accountModalopen: true });
  },
}));

export default useControlModal;
