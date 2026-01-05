import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

interface DropdownContextType {
  openDropdown: string | null;
  toggleDropdown: (id: string) => void;
  closeDropdown: () => void;
}

const DropdownContext = createContext<DropdownContextType | undefined>(undefined);

export function DropdownProvider({ children }: { children: ReactNode }) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (id: string) => {
    setOpenDropdown((prev) => (prev === id ? null : id));
  };

  const closeDropdown = () => setOpenDropdown(null);

  const value = useMemo(() => ({ openDropdown, toggleDropdown, closeDropdown }), [openDropdown]);

  return <DropdownContext.Provider value={value}>{children}</DropdownContext.Provider>;
}

export const useDropdown = () => {
  const context = useContext(DropdownContext);

  if (!context) throw new Error('useDropdown은 DropdownProvider와 함께 사용해야합니다.');

  return context;
};
