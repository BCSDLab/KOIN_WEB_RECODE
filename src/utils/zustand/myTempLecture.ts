import { LectureInfo } from 'interfaces/Lecture';
import { create } from 'zustand';

interface TempLectureState {
  tempLecture: LectureInfo | null;
  setTempLecture: (tempLecture: LectureInfo | null) => void;
}

export const useTempLecture = create<TempLectureState>((set, get) => ({
  tempLecture: null,
  setTempLecture: (newTempLecture: LectureInfo | null) => {
    if (get().tempLecture !== newTempLecture) {
      set({ tempLecture: newTempLecture });
    }
  },
}));
