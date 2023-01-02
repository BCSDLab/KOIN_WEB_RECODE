import { atom, selector } from 'recoil';
import { LectureInfo, TimeTableDayLectureInfo, TimeTableLectureInfo } from 'interfaces/Lecture';
import { getTimeTableInfo } from 'api/timetable';
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

export const myLecturesAtom = atom<TimeTableLectureInfo[]>({
  key: 'myLectures',
  default: selector({
    key: 'myLectures/default',
    get: async ({ get }) => {
      if (get(selectedSemesterAtom) === '') {
        return [];
      }
      if (!get(tokenState)) {
        return JSON.parse(localStorage.getItem(MY_LECTURES_KEY) ?? '[]') as TimeTableLectureInfo[];
      }
      const timeTableData = await getTimeTableInfo(
        get(tokenState),
        get(selectedSemesterAtom),
      ).then((value) => value.timetable);
      return timeTableData;
    },
  }),
});

export const myLectureTimeSelector = selector({
  key: 'myLectures/TimeSelector',
  get: ({ get }) => (get(myLecturesAtom)
    .reduce((acc, cur) => acc.concat(cur.class_time), [] as number[])),
});

export const myLectureDaySelector = selector({
  key: 'myLectures/DaySelector',
  get: ({ get }) => (Array.from({ length: 5 }).map((_, index) => {
    const currentDayInfo = [] as TimeTableDayLectureInfo[];
    get(myLecturesAtom).forEach((lecture, lectureIndex) => {
      const currentDayClassTime = lecture.class_time
        .filter((time) => Math.floor(time / 100) === index)
        .map((time) => time % 100)
        .sort((a, b) => a - b);

      if (currentDayClassTime.length) {
        currentDayInfo.push({
          start: currentDayClassTime[0],
          end: currentDayClassTime[currentDayClassTime.length - 1],
          name: lecture.class_title,
          lecture_class: lecture.lecture_class,
          professor: lecture.professor,
          index: lectureIndex,
        });
      }
    });

    return currentDayInfo;
  })),
});
