import { create } from "zustand";

type FheBalance = {
  balance: string;
  setBalance: (balance: string) => void;
};

const useGetFheBalanceStore = create<FheBalance>((set, get) => ({
  balance: "",
  setBalance: (balance: string) => {
    set({ balance: balance });
  },
}));

export default useGetFheBalanceStore;
