import { persist } from 'zustand/middleware';
import { create } from 'zustand';

type State = {
  semester: string;
};

type Action = {
  action: {
    updateSemester: (semester: State['semester']) => void;
  };
};

const useSemesterStore = create(
  persist<State & Action>(
    (set) => ({
      semester: '',
      action: {
        updateSemester: (semester) => set(() => ({ semester })),
      },
    }),
    {
      name: 'semester',
      partialize: (state) => ({ semester: state.semester }) as State & Action,
    }
  )
);

export const useSemester = () => useSemesterStore((state) => state.semester);

export const useSemesterAction = () => useSemesterStore((store) => store.action);
