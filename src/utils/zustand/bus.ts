import { create } from 'zustand';
import { BUS_TYPES } from 'static/bus';

interface BusState {
  selectedTab: typeof BUS_TYPES[number];
  setSelectedTab: (tab: typeof BUS_TYPES[number]) => void;
}

export const useBusStore = create<BusState>((set) => ({
  selectedTab: BUS_TYPES[0],
  setSelectedTab: (tab: typeof BUS_TYPES[number]) => set({ selectedTab: tab }),
}));
