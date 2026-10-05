import { create } from 'zustand';

interface ServerState {
  isMaintenance: boolean;
  setMaintenance: (on: boolean) => void;
}
export const useServerStateStore = create<ServerState>((set) => ({
  isMaintenance: false,
  setMaintenance: (on) => set({ isMaintenance: on }),
}));
