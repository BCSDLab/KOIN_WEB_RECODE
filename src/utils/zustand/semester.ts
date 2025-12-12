import { Semester } from 'api/timetable/entity';
import { getRecentSemester } from 'utils/timetable/semester';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type State = {
  semester: Semester;
};

type Action = {
  action: {
    updateSemester: (semester: State['semester']) => void;
  };
};

const useSemesterStore = create(
  persist<State & Action>(
    (set) => ({
      semester: getRecentSemester(),
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
