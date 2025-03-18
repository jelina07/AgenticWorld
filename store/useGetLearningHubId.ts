import { create } from "zustand";

type LearningHub = {
  learningHubId: number;
  setLearningHubId: (tokenId: number) => Promise<void>;
};

const useGetLearningHubId = create<LearningHub>((set, get) => ({
  learningHubId: 0,

  setLearningHubId: async (learningHubId: number) => {
    set({ learningHubId: learningHubId });
  },
}));

export default useGetLearningHubId;
