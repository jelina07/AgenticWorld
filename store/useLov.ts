import request from "@/sdk/request";
import { create } from "zustand";

const LovType = "CONTRACT_ADDRESS"; //"CONTRACT_ADDRESS,aaaa"

type Lov = {
  key: string;
  type: string;
  value: any;
};

type LovState = {
  lovs: Lov[];
  fetchLov: () => Promise<void>;
  getContractAdress: () => Lov[];
};

export const useLov = create<LovState>((set, get) => ({
  lovs: [],
  fetchLov: async () => {
    const res = (await request.get("/lov", {
      params: {
        type: LovType,
      },
    })) as Lov[];
    if (res) {
      set({ lovs: res });
    }
  },

  getContractAdress() {
    return get().lovs.filter((item) => item.type === "CONTRACT_ADDRESS");
  },
}));
