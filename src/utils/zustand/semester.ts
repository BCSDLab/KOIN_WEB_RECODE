import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Semester, Term } from 'api/timetable/entity';

type State = {
  semester: Semester;
};

type Action = {
  action: {
    updateSemester: (semester: State['semester']) => void;
  };
};

const getRecentSemester = () => {
  const date = new Date();
  const year = date.getFullYear();
  const term = date.getMonth() + 1;
  if (term < 2) {
    return {
      year: year - 1,
      term: '겨울학기' as Term,
    };
  }
  if (term < 6) {
    return {
      year,
      term: '1학기' as Term,
    };
  }
  if (term < 8) {
    return {
      year,
      term: '여름학기' as Term,
    };
  }
  if (term < 13) {
    return {
      year,
      term: '2학기' as Term,
    };
  }

  return {
    year,
    term: '1학기' as Term,
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
