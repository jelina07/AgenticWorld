import { create } from "zustand";

type Agent = {
  agentTokenId: number;
  setAgentTokenId: (tokenId: number) => Promise<void>;
};

const useAgentGetTokenId = create<Agent>((set, get) => ({
  agentTokenId: 0,
  setAgentTokenId: async (agentTokenId: number) => {
    set({ agentTokenId: agentTokenId });
  },
}));

export default useAgentGetTokenId;
