import { create } from "zustand";

type Agent = {
  agentTokenId: number;
  setAgentTokenId: (tokenId: number) => void;
  refreshGetAgentTokenId: Function;
  setRefreshGetAgentTokenId: (refreshGetAgentTokenId: Function) => void;
};

const useAgentGetTokenId = create<Agent>((set, get) => ({
  agentTokenId: 0,
  refreshGetAgentTokenId: () => {},
  setAgentTokenId: async (agentTokenId: number) => {
    set({ agentTokenId: agentTokenId });
  },
  setRefreshGetAgentTokenId: async (refreshGetAgentTokenId: Function) => {
    set({ refreshGetAgentTokenId: refreshGetAgentTokenId });
  },
}));

export default useAgentGetTokenId;
