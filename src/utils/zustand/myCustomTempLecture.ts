import { create } from 'zustand';

interface State {
  customTempLecture: {
    class_title: string;
    professor: string;
    lecture_infos: Array<{
      id: string;
      days: string[];
      start_time: number;
      end_time: number;
      place: string;
    }>;
    grades?: string;
    memo?: string;
  } | null;
}

interface Action {
  action: {
    updateCustomTempLecture: (customTempLecture: State['customTempLecture']) => void;
  };
}

const useCustomTempLectureStore = create<State & Action>((set, get) => ({
  customTempLecture: {
    class_title: '',
    lecture_infos: [
      {
        id: '',
        days: [],
        start_time: 0,
        end_time: 0,
        place: '',
      },
    ],
    professor: '',
    grades: '0',
  },
  action: {
    updateCustomTempLecture: (customTempLecture) => {
      if (get().customTempLecture !== customTempLecture) {
        set(() => ({ customTempLecture }));
      }
    },
  },
}));

export const useCustomTempLecture = () => useCustomTempLectureStore((state) => state.customTempLecture);

export const useCustomTempLectureAction = () => useCustomTempLectureStore((state) => state.action);
