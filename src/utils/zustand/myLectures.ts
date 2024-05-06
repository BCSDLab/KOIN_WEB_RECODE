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
    addLecture: (lecture: LectureInfo, semester: string) => void;
    removeLecture: (lecture: LectureInfo, semester: string) => void;
  }
};

export const useLecturesStore = create<State & Action>(
  (set, get) => ({
    lectures: JSON.parse(localStorage.getItem(MY_LECTURES_KEY) ?? '{}'),
    action: {
      addLecture: (lecture, semester) => {
        const timetableInfoList = get().lectures;
        const newValue = [...(timetableInfoList[semester] || [])];
        newValue.push(lecture);

        localStorage.setItem(
          MY_LECTURES_KEY,
          JSON.stringify({ ...timetableInfoList, [semester]: newValue }),
        );
        set(() => ({ lectures: { ...timetableInfoList, [semester]: newValue } }));
      },
      removeLecture: (lecture, semester) => {
        const timetableInfoList = get().lectures;
        const timetableInfoWithNewValue = timetableInfoList[semester].filter(
          (newValue) => (lecture.code !== newValue.code)
            || (lecture.lecture_class !== newValue.lecture_class),
        );
        localStorage.setItem(
          MY_LECTURES_KEY,
          JSON.stringify({ ...timetableInfoList, [semester]: timetableInfoWithNewValue }),
        );
        set(() => ({ lectures: { ...timetableInfoList, [semester]: timetableInfoWithNewValue } }));
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
