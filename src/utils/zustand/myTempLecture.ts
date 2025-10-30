import { Lecture } from 'api/timetable/entity';
import { create } from 'zustand';

type State = {
  tempLecture: Lecture | null;
};

type Action = {
  action: {
    updateTempLecture: (tempLecture: State['tempLecture']) => void;
  };
};

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
