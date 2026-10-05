import { Lecture } from 'api/timetable/entity';
import { isomorphicLocalStorage } from 'utils/ts/env';
import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

interface TimetableInfoFromLocalStorage {
  [key: string]: Lecture[];
}

const MY_LECTURES_KEY = 'my-lectures';

const getInitialLectures = (): TimetableInfoFromLocalStorage => {
  return isomorphicLocalStorage.getJSONItem<TimetableInfoFromLocalStorage>(MY_LECTURES_KEY, {});
};

type State = {
  lectures: TimetableInfoFromLocalStorage;
};

type Action = {
  action: {
    addLecture: (lecture: Lecture, semester: string) => void;
    removeLecture: (lecture: Lecture, semester: string) => void;
  };
};

interface TimeStringState {
  timeString: string[];
  setTimeString: (newTimeString: string[]) => void;
}

export const useLecturesStore = create<State & Action>((set, get) => ({
  lectures: getInitialLectures(),
  action: {
    addLecture: (lecture, semester) => {
      const timetableInfoList = get().lectures;
      const newValue = [...(timetableInfoList[semester] || [])];
      newValue.push(lecture);

      isomorphicLocalStorage.setJSONItem(MY_LECTURES_KEY, { ...timetableInfoList, [semester]: newValue });
      set(() => ({ lectures: { ...timetableInfoList, [semester]: newValue } }));
    },
    removeLecture: (lecture, semester) => {
      const timetableInfoList = get().lectures;
      const timetableInfoWithNewValue = timetableInfoList[semester].filter(
        (newValue) => lecture.code !== newValue.code || lecture.lecture_class !== newValue.lecture_class,
      );
      isomorphicLocalStorage.setJSONItem(MY_LECTURES_KEY, {
        ...timetableInfoList,
        [semester]: timetableInfoWithNewValue,
      });
      set(() => ({ lectures: { ...timetableInfoList, [semester]: timetableInfoWithNewValue } }));
    },
  },
}));

export const useLecturesState = (semester: string) => {
  const lectures = useLecturesStore(useShallow((state) => state.lectures));
  return lectures[semester];
};

export const useLecturesAction = () => useLecturesStore((state) => state.action);

export const useTimeString = create<TimeStringState>((set) => ({
  timeString: ['9', '10', '11', '12', '13', '14', '15', '16', '17', '18'].flatMap((time) => [time, '']),
  setTimeString: (newTimeString: string[]) => set({ timeString: newTimeString }),
}));
