import { AddTimetableCustomLecture } from 'api/timetable/entity';
import { create } from 'zustand';

type State = {
  customTempLecture: AddTimetableCustomLecture | null;
};

type Action = {
  action: {
    updateCustomTempLecture: (customTempLecture: State['customTempLecture']) => void
  }
};

const useCustomTempLectureStore = create<State & Action>((set, get) => ({
  customTempLecture: {
    class_title: '',
    lecture_infos: [
      {
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

export const useCustomTempLecture = () => useCustomTempLectureStore(
  (state) => state.customTempLecture,
);

export const useCustomTempLectureAction = () => useCustomTempLectureStore((state) => state.action);
