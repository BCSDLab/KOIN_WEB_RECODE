import type { Semester } from 'api/timetable/entity';
import { getRecentSemester } from 'utils/timetable/semester';
import { writeSemesterCookie } from 'utils/timetable/semesterCookie';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface State {
  semester: Semester;
}

interface Action {
  action: {
    updateSemester: (semester: State['semester']) => void;
  };
}

const useSemesterStore = create(
  persist<State & Action>(
    (set) => ({
      semester: getRecentSemester(),
      action: {
        updateSemester: (semester) => {
          set(() => ({ semester }));
          writeSemesterCookie(semester);
        },
      },
    }),
    {
      name: 'semester',
      partialize: (state) => ({ semester: state.semester }) as State & Action,
      // 쿠키 도입 전부터 localStorage에만 학기가 있던 사용자도 첫 로드에서 쿠키가 채워지도록 한다.
      onRehydrateStorage: () => (state) => {
        if (state) writeSemesterCookie(state.semester);
      },
    },
  ),
);

export const useSemester = () => useSemesterStore((state) => state.semester);

export const useSemesterAction = () => useSemesterStore((store) => store.action);
