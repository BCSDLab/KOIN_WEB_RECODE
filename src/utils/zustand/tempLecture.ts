import { LectureInfo } from 'interfaces/Lecture';
import createSelectors from 'utils/zustand/createSelector';
import { create } from 'zustand';

type SelectedTempLecture = {
  tempLectureInfo: LectureInfo | null;
};

type Actions = {
  setTempLecture: (newValue: LectureInfo | null) => void;
};

const initialState: SelectedTempLecture = {
  tempLectureInfo: null,
};

const useSelectedTempLecture = create< SelectedTempLecture & Actions>()((set, get) => ({
  ...initialState,
  setTempLecture: (newValue) => {
    if (get().tempLectureInfo !== newValue) {
      set({ tempLectureInfo: newValue });
    } else {
      set(initialState);
    }
  },
}));

export const selectedTempLectureSelector = createSelectors(useSelectedTempLecture);
