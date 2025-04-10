import request from "@/sdk/request";
import { create } from "zustand";

const type = "CONTRACT_ADDRESS";

type Lov = {
  key: string;
  type: string;
  value: any;
};

type LovState = {
  lovs: Lov[];
  fetchLov: () => Promise<void>;
  getContractAdress: () => Promise<Lov[] | undefined>;
};

export const useLov = create<LovState>((set, get) => ({
  lovs: [],
  fetchLov: async () => {
    const res = (await request.get("/lov", { params: type })) as Lov[];
    if (res) {
      set({ lovs: res });
    }
  },

  async getContractAdress() {
    return get().lovs.filter((item) => item.key === "CONTRACT_ADDRESS");
  },
}));
