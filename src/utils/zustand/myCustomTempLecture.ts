import { AddTimetableLecture } from 'api/timetable/entity';
import { create } from 'zustand';

type State = {
  customTempLecture: AddTimetableLecture | null;
};

type Action = {
  action: {
    updateCustomTempLecture: (customTempLecture: State['customTempLecture']) => void
  }
};

const useCustomTempLectureStore = create<State & Action>((set, get) => ({
  customTempLecture: {
    timetable_lecture: {
      class_title: '',
      lecture_infos: [
        {
          day: 0,
          start_time: 0,
          end_time: 0,
          place: '',
        },
      ],
      professor: '',
    },
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
