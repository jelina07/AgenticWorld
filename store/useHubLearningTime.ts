import { create } from "zustand";

type HubLearningTime = {
  hubLearningTime: Array<number>;
  refreshGetHubLearningTime: Function;
  setHubLearningTime: (hubLearningTime: Array<number>) => void;
  setRefreshGetHubLearningTime: (refreshGetHubLearningTime: Function) => void;
};

const useHubLearningTime = create<HubLearningTime>((set, get) => ({
  hubLearningTime: [],
  refreshGetHubLearningTime: () => {},
  setHubLearningTime: async (hubLearningTime: Array<number>) => {
    set({ hubLearningTime: hubLearningTime });
  },
  setRefreshGetHubLearningTime: async (refreshGetHubLearningTime: Function) => {
    set({ refreshGetHubLearningTime: refreshGetHubLearningTime });
  },
}));

export default useHubLearningTime;
