import { atom, DefaultValue, selector } from 'recoil';
import {
  LectureInfo,
  TimetableInfoFromLocalStorage,
} from 'interfaces/Lecture';
import { tokenState } from './index';

export const selectedTempLectureAtom = atom<LectureInfo | null>({
  key: 'selectedTempLecture',
  default: null,
});

export const selectedSemesterAtom = atom<string>({
  key: 'selectedSemester',
  default: '',
});

export const selectedTempLectureSelector = selector({
  key: 'selectedTempLecture/select',
  get: ({ get }) => get(selectedTempLectureAtom),
  set: ({ get, set }, newValue) => {
    if (get(selectedTempLectureAtom) !== newValue) {
      set(selectedTempLectureAtom, newValue);
    } else {
      set(selectedTempLectureAtom, null);
    }
  },
});

const MY_LECTURES_KEY = 'my-lectures';

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

export const myLecturesAtom = atom<LectureInfo[] | null>({
  key: 'myLectures',
  default: null,
  effects: [
    ({ getLoadable, setSelf, onSet }) => {
      if (getLoadable(tokenState).contents) {
        return;
      }
      waitForTruthyValue(
        (() => getLoadable(
          selectedSemesterAtom,
        ).contents) as () => string,
      )
        .then((value) => {
          const savedValue = localStorage.getItem(MY_LECTURES_KEY);
          if (savedValue != null) {
            setSelf(JSON.parse(savedValue)[value]);
            return;
          }
          setSelf([]);
        });

      onSet((newValue, _, isReset) => {
        if (isReset) {
          localStorage.removeItem(MY_LECTURES_KEY);
          return;
        }
        if (newValue === null) {
          return;
        }

        const timetableInfoList = JSON.parse(
          localStorage.getItem(MY_LECTURES_KEY) ?? '{}',
        ) as TimetableInfoFromLocalStorage;
        timetableInfoList[
          getLoadable(selectedSemesterAtom).contents
        ] = newValue ?? [];
        localStorage.setItem(MY_LECTURES_KEY, JSON.stringify(timetableInfoList));
      });
    },
  ],
});

export const myLectureAddLectureSelector = selector<LectureInfo>({
  key: 'myLecture/AddLecture',
  get: ({ get }) => (get(myLecturesAtom) ?? [])[0], // setter only.
  set: ({ get, set }, newValue) => {
    if (newValue instanceof DefaultValue) {
      set(myLecturesAtom, newValue);
      return;
    }

    const timetableInfo = get(myLecturesAtom);
    if (!timetableInfo) {
      return;
    }
    const timetableInfoWithNewValue = timetableInfo.concat(newValue);
    set(myLecturesAtom, timetableInfoWithNewValue);
  },
});

export const myLectureRemoveLectureSelector = selector<LectureInfo>({
  key: 'myLecture/RemoveLecture',
  get: ({ get }) => (get(myLecturesAtom) ?? [])[0], // setter only.
  set: ({ get, set }, newValue) => {
    if (newValue instanceof DefaultValue) {
      set(myLecturesAtom, newValue);
      return;
    }
    const timetableInfo = get(myLecturesAtom);
    if (!timetableInfo) {
      return;
    }
    const timetableInfoWithNewValue = timetableInfo.filter(
      (lecture) => lecture.code !== newValue.code,
    );
    set(myLecturesAtom, timetableInfoWithNewValue);
  },
});
