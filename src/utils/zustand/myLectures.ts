/* eslint-disable react-hooks/rules-of-hooks */
import { LectureInfo, TimetableInfoFromLocalStorage } from 'interfaces/Lecture';
import useTokenState from 'utils/hooks/useTokenState';
import { create } from 'zustand';
import { useSemester } from './semester';

const MY_LECTURES_KEY = 'my-lectures';

type State = {
  lectures: TimetableInfoFromLocalStorage;
};

type Action = {
  action: {
    updateLectures: (lectures: LectureInfo) => void
  }
};

export const useLecturesStore = create<State & Action>(
  () => ({
    lectures: localStorage.getItem(MY_LECTURES_KEY) ?? {},
    action: {
      updateLectures: async (value) => {
        const token = useTokenState();
        if (token) {
          return;
        }
        const semester = useSemester();
        localStorage.setItem(MY_LECTURES_KEY, JSON.stringify({ [semester]: value }));
      },
    },
  }),
);

export const useLecturesState = () => useLecturesStore((state) => state.lectures);
export const useLecturesAction = () => useLecturesStore((state) => state.action);
