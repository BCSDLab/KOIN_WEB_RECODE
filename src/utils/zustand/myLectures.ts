/* eslint-disable react-hooks/rules-of-hooks */
import { LectureInfo, TimetableInfoFromLocalStorage } from 'interfaces/Lecture';
import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import { useSemester } from './semester';

const MY_LECTURES_KEY = 'my-lectures';

type State = {
  lectures: TimetableInfoFromLocalStorage;
};

type Action = {
  action: {
    updateLectures: (lectures: LectureInfo, semester: string) => void;
  }
};

export const useLecturesStore = create<State & Action>(
  (set) => ({
    lectures: JSON.parse(localStorage.getItem(MY_LECTURES_KEY) ?? '{}'),
    action: {
      updateLectures: async (value, semester) => {
        const timetableInfoList = JSON.parse(localStorage.getItem(MY_LECTURES_KEY) ?? '{}');
        const newValue = [...(timetableInfoList[semester] || [])];
        newValue.push(value);

        localStorage.setItem(
          MY_LECTURES_KEY,
          JSON.stringify({ ...timetableInfoList, [semester]: newValue }),
        );
        set(() => ({ lectures: { ...timetableInfoList, [semester]: newValue } }));
      },
    },
  }),
);

export const useLecturesState = () => {
  const semester = useSemester();
  const lectures = useLecturesStore(useShallow((state) => state.lectures));
  return lectures[semester];
};

export const useLecturesAction = () => useLecturesStore((state) => state.action);
