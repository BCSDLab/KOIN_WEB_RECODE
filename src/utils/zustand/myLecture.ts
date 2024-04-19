/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-useless-return */
import { LectureInfo } from 'interfaces/Lecture';
import createSelectors from 'utils/zustand/createSelector';
import { create } from 'zustand';

type SelectedSemester = string;

const temptokenState = '';

type State = {
  myLectures: LectureInfo[];
};

type Actions = {
  setMyLecture: (newValue: LectureInfo) => void;
};

const initialState: State = {
  myLectures: [],
};

function waitForTruthyValue<T>(getValue: () => T, timeout = 1000): Promise<T> {
  return new Promise((resolve) => {
    function endSetTimeoutWhenValueNonNullable() {
      setTimeout(() => {
        const value = getValue();
        if (value) {
          resolve(value);
        } else {
          endSetTimeoutWhenValueNonNullable();
        }
      }, timeout);
    }
    endSetTimeoutWhenValueNonNullable();
  });
}

// const myLectureAddLecture = create<State & Actions>()((set, get) => ({
//   ...initialState,
//   setMyLecture: (newValue) => {
//     const timetableInfo = get().myLectures;
//     const newtimeTableInfo = timetableInfo?.concat(newValue);
//     if (timetableInfo) {
//       set();
//     }
//   },
// }));

// export const selectedTempLectureSelector = createSelectors(useSelectedTempLecture);
