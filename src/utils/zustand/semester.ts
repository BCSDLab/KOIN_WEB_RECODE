import { create } from 'zustand';

type State = {
  semester: string
};

type Action = {
  action: {
    updateSemester: (semester: State['semester']) => void
  }
};

const useSemesterStore = create<State & Action>((set) => ({
  semester: '',
  action: {
    updateSemester: (semester) => set(() => ({ semester })),
  },
}));

export const useSemester = () => useSemesterStore((state) => state.semester);

export const useSemesterAction = () => useSemesterStore((store) => store.action);
