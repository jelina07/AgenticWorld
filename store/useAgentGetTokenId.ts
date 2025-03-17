import { create } from "zustand";

type MindPass = {
  agentTokenId: number;
  setAgentTokenId: (tokenId: number) => Promise<void>;
};

const useAgentGetTokenIdStore = create<MindPass>((set, get) => ({
  agentTokenId: 0,

  setAgentTokenId: async (agentTokenId) => {
    set({ agentTokenId: agentTokenId });
  },
}));

export default useAgentGetTokenIdStore;
