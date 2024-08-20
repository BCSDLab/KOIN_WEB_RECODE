/* eslint-disable react-hooks/rules-of-hooks */
import { LectureInfo, TimetableInfoFromLocalStorageV2 } from 'interfaces/Lecture';
import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

const MY_LECTURES_V2_KEY = 'my-lectures-v2';

type State = {
  lecturesV2: TimetableInfoFromLocalStorageV2;
};

type Action = {
  action: {
    addLecture: (lecture: LectureInfo, frameId: number) => void;
    removeLecture: (lecture: LectureInfo, frameId: number) => void;
  }
};

interface TimeStringState {
  timeString: string[];
  setTimeString: (newTimeString: string[]) => void;
}

export const useLecturesStore = create<State & Action>(
  (set, get) => ({
    lecturesV2: JSON.parse(localStorage.getItem(MY_LECTURES_V2_KEY) ?? '{}'),
    action: {
      addLecture: (lecture, frameId) => {
        const timetableInfoList = get().lecturesV2;
        const newValue = [...(timetableInfoList[frameId] || [])];
        newValue.push(lecture);

        localStorage.setItem(
          MY_LECTURES_V2_KEY,
          JSON.stringify({ ...timetableInfoList, [frameId]: newValue }),
        );
        set(() => ({ lecturesV2: { ...timetableInfoList, [frameId]: newValue } }));
      },
      removeLecture: (lecture, frameId) => {
        const timetableInfoList = get().lecturesV2;
        const timetableInfoWithNewValue = timetableInfoList[frameId].filter(
          (newValue) => (lecture.code !== newValue.code)
            || (lecture.lecture_class !== newValue.lecture_class),
        );
        localStorage.setItem(
          MY_LECTURES_V2_KEY,
          JSON.stringify({ ...timetableInfoList, [frameId]: timetableInfoWithNewValue }),
        );
        set(() => ({ lecturesV2: { ...timetableInfoList, [frameId]: timetableInfoWithNewValue } }));
      },
    },
  }),
);

export const useLecturesState = (frameId: number) => {
  const lecturesV2 = useLecturesStore(useShallow((state) => state.lecturesV2));
  return lecturesV2[frameId];
};

export const useLecturesAction = () => useLecturesStore((state) => state.action);

export const useTimeString = create<TimeStringState>((set) => ({
  timeString: ['9', '10', '11', '12', '13', '14', '15', '16', '17', '18'].flatMap((time) => [time, '']),
  setTimeString: (newTimeString: string[]) => set({ timeString: newTimeString }),
}));
