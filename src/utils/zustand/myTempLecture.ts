import { LectureInfo } from 'interfaces/Lecture';
import { create } from 'zustand';

// type State = {
//   tempLecture: LectureInfo | null;
// };
//
// type Action = {
//   action: {
//     updateTempLecture: (tempLecture: State['tempLecture']) => void
//   }
// };
//
// const useTempLectureStore = create<State & Action>((set, get) => ({
//   tempLecture: null,
//   action: {
//     updateTempLecture: (tempLecture) => {
//       if (get().tempLecture === tempLecture) {
//         set(() => ({ tempLecture: null }));
//         return;
//       }
//       set(() => ({ tempLecture }));
//     },
//   },
// }));
//
// export const useTempLecture = () => useTempLectureStore((state) => state.tempLecture);
//
// export const useTempLectureAction = () => useTempLectureStore((store) => store.action);

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
