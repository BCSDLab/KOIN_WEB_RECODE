/* eslint-disable react-hooks/rules-of-hooks */
import { LectureInfo, TimetableInfoFromLocalStorageV2 } from 'interfaces/Lecture';
import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

const MY_LECTURES_KEY = 'my-lectures';

type State = {
  lecturesV2: TimetableInfoFromLocalStorageV2;
};

type Action = {
  action: {
    addLecture: (lecture: LectureInfo, semester: string) => void;
    removeLecture: (lecture: LectureInfo, semester: string) => void;
  }
};

export const useLecturesStore = create<State & Action>(
  (set, get) => ({
    lecturesV2: JSON.parse(localStorage.getItem(MY_LECTURES_KEY) ?? '{}'),
    action: {
      addLecture: (lecture, semester) => {
        const timetableInfoList = get().lecturesV2;
        const newValue = [...(timetableInfoList[semester] || [])];
        newValue.push(lecture);

        localStorage.setItem(
          MY_LECTURES_KEY,
          JSON.stringify({ ...timetableInfoList, [semester]: newValue }),
        );
        set(() => ({ lecturesV2: { ...timetableInfoList, [semester]: newValue } }));
      },
      removeLecture: (lecture, semester) => {
        const timetableInfoList = get().lecturesV2;
        const timetableInfoWithNewValue = timetableInfoList[semester].filter(
          (newValue) => (lecture.code !== newValue.code)
            || (lecture.lecture_class !== newValue.lecture_class),
        );
        localStorage.setItem(
          MY_LECTURES_KEY,
          JSON.stringify({ ...timetableInfoList, [semester]: timetableInfoWithNewValue }),
        );
        set(() => (
          { lecturesV2: { ...timetableInfoList, [semester]: timetableInfoWithNewValue } }
        ));
      },
    },
  }),
);

export const useLecturesState = (semester: string) => {
  const lecturesV2 = useLecturesStore(useShallow((state) => state.lecturesV2));
  return lecturesV2[semester];
};

export const useLecturesAction = () => useLecturesStore((state) => state.action);
