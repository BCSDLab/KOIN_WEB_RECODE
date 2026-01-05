import { Lecture } from 'api/timetable/entity';
import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

interface TimetableInfoFromLocalStorage {
  [key: string]: Lecture[];
}

const MY_LECTURES_KEY = 'my-lectures';

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
  lectures: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem(MY_LECTURES_KEY) ?? '{}') : {},
  action: {
    addLecture: (lecture, semester) => {
      const timetableInfoList = get().lectures;
      const newValue = [...(timetableInfoList[semester] || [])];
      newValue.push(lecture);

      localStorage.setItem(MY_LECTURES_KEY, JSON.stringify({ ...timetableInfoList, [semester]: newValue }));
      set(() => ({ lectures: { ...timetableInfoList, [semester]: newValue } }));
    },
    removeLecture: (lecture, semester) => {
      const timetableInfoList = get().lectures;
      const timetableInfoWithNewValue = timetableInfoList[semester].filter(
        (newValue) => lecture.code !== newValue.code || lecture.lecture_class !== newValue.lecture_class,
      );
      localStorage.setItem(
        MY_LECTURES_KEY,
        JSON.stringify({ ...timetableInfoList, [semester]: timetableInfoWithNewValue }),
      );
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
