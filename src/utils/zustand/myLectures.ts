/* eslint-disable react-hooks/rules-of-hooks */
import { LectureInfo, TimetableInfoFromLocalStorage } from 'interfaces/Lecture';
import { create } from 'zustand';

const MY_LECTURES_KEY = 'my-lectures';

type State = {
  lectures: TimetableInfoFromLocalStorage;
};

type Action = {
  action: {
    updateLectures: (lectures: LectureInfo | null, semester: string) => void
  }
};

export const useLecturesStore = create<State & Action>(
  () => ({
    lectures: localStorage.getItem(MY_LECTURES_KEY) ?? {},
    action: {
      updateLectures: async (value, semester) => {
        localStorage.setItem(MY_LECTURES_KEY, JSON.stringify({ [semester]: value }));
      },
    },
  }),
);

export const useLecturesState = () => useLecturesStore((state) => state.lectures);
export const useLecturesAction = () => useLecturesStore((state) => state.action);
