import { TimetableLectureInfo } from 'api/timetable/entity';
import { create } from 'zustand';

type State = {
  customTempLecture: Omit<TimetableLectureInfo, 'lecture_id' | 'id'> | null;
};

type Action = {
  action: {
    updateCustomTempLecture: (customTempLecture: State['customTempLecture']) => void
  }
};

const useCustomTempLectureStore = create<State & Action>((set, get) => ({
  customTempLecture: {
    class_title: '',
    class_infos: [{
      class_time: [],
      class_place: '',
    }],
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
