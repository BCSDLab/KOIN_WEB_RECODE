import type { Lecture } from 'api/timetable/entity';
import { create } from 'zustand';

interface State {
  tempLecture: Lecture | null;
}

interface Action {
  action: {
    updateTempLecture: (tempLecture: State['tempLecture']) => void;
  };
}

const useTempLectureStore = create<State & Action>((set, get) => ({
  tempLecture: null,
  action: {
    updateTempLecture: (tempLecture) => {
      if (get().tempLecture === tempLecture) {
        set(() => ({ tempLecture: null }));

        return;
      }
      set(() => ({ tempLecture }));
    },
  },
}));

export const useTempLecture = () => useTempLectureStore((state) => state.tempLecture);

export const useTempLectureAction = () => useTempLectureStore((store) => store.action);
