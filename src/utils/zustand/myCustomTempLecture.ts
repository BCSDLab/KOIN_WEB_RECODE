import { create } from 'zustand';

type State = {
  customTempLecture: {
    class_title: string;
    professor: string;
    lecture_infos: {
      id: string;
      days: string[];
      start_time: number;
      end_time: number;
      place: string;
    }[];
    grades?: string;
    memo?: string;
  } | null;
};

type Action = {
  action: {
    updateCustomTempLecture: (customTempLecture: State['customTempLecture']) => void;
  };
};

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
