import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Semester } from 'api/timetable/entity';

type State = {
  semester: Semester | null
};

type Action = {
  action: {
    updateSemester: (semester: State['semester']) => void
  }
};

const useSemesterStore = create(
  persist<State & Action>(
    (set) => ({
      semester: null,
      action: {
        updateSemester: (semester) => set(() => ({ semester })),
      },
    }),
    {
      name: 'semester',
      partialize: (state) => ({ semester: state.semester }) as State & Action,
    },
  ),
);

export const useSemester = () => useSemesterStore((state) => state.semester);

export const useSemesterAction = () => useSemesterStore((store) => store.action);
