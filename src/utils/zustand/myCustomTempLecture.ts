import { CustomTimetableLectureInfo } from 'interfaces/Lecture';
import { create } from 'zustand';

type State = {
  customTempLecture: CustomTimetableLectureInfo | null;
};

type Action = {
  action: {
    updateCustomTempLecture: (customTempLecture: State['customTempLecture']) => void
  }
};

const useCustomTempLectureStore = create<State & Action>((set, get) => ({
  customTempLecture: {
    class_title: '',
    class_time: [],
  },
  action: {
    updateCustomTempLecture: (customTempLecture) => {
      if (get().customTempLecture !== customTempLecture) {
        set(() => ({ customTempLecture }));
      }
    },
  },
}));

export const useCustomTempLecture = () => useCustomTempLectureStore(
  (state) => state.customTempLecture,
);

export const useCustomTempLectureAction = () => useCustomTempLectureStore((state) => state.action);
