import { create } from 'zustand';
import { BUS_TYPES } from 'static/bus';

type BusType = {
  key: string;
  tabName: string;
  tableHeaders: string[];
};

type BusState = {
  selectedTab: BusType;
  setSelectedTab: (tab: BusType) => void;
};

export const useBusStore = create<BusState>((set) => ({
  selectedTab: BUS_TYPES[0],
  setSelectedTab: (tab: BusType) => set({ selectedTab: tab }),
}));
