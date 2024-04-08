import { LectureInfo } from 'interfaces/Lecture';
import createSelectors from 'utils/recoil/createSelector';
import { create } from 'zustand';

// code: "",
//   name: "",
//   grades: "",
//   lecture_class: "",
//   regular_number: "",
//   department: "",
//   target: "",
//   professor: "",
//   design_score: "",
//   class_time: [],

// define the initial state
type SelectedTempLecture = {
  tempLectureInfo: LectureInfo | null;
};

type Actions = {
  addTempLecture: (newValue: LectureInfo | null) => void;
};

const initialState: SelectedTempLecture = {
  tempLectureInfo: null,
};

const useSelectedTempLecture = create< SelectedTempLecture & Actions>()((set, get) => ({
  ...initialState,
  addTempLecture: (newValue) => {
    if (get().tempLectureInfo !== newValue) {
      set({ tempLectureInfo: newValue });
    } else {
      set(initialState);
    }
  },
}));

export const selectedTempLectureSelector = createSelectors(useSelectedTempLecture);
