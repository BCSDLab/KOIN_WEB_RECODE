import create from 'zustand';
import { useEffect } from 'react';
import useMediaQuery from 'utils/hooks/useMediaQuery';
import { useLocation } from 'react-router-dom';

interface SidebarState {
  isSidebarOpen: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
}

const useSidebarStore = create<SidebarState>((set) => ({
  isSidebarOpen: false,
  openSidebar: () => set({ isSidebarOpen: true }),
  closeSidebar: () => set({ isSidebarOpen: false }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
}));

export function useMobileSidebar() {
  const { pathname } = useLocation();
  const isMobile = useMediaQuery();
  const {
    isSidebarOpen, closeSidebar, openSidebar, toggleSidebar,
  } = useSidebarStore((state) => ({
    isSidebarOpen: state.isSidebarOpen,
    closeSidebar: state.closeSidebar,
    openSidebar: state.openSidebar,
    toggleSidebar: state.toggleSidebar,
  }));

  useEffect(() => {
    if (!isMobile) {
      closeSidebar();
    }
  }, [closeSidebar, isMobile]);

  useEffect(() => {
    closeSidebar();
  }, [closeSidebar, pathname]);

  return {
    isSidebarOpen,
    openSidebar,
    closeSidebar,
    toggleSidebar,
  };
}
