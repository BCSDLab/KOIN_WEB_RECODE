import React from 'react';
import {
  CustomTimetableLectureInfo,
  LectureInfo,
  TimetableDayLectureInfo,
  TimetableLectureInfoV2,
} from 'interfaces/Lecture';

export default function useTimetableDayListV2(
  myLectures: TimetableLectureInfoV2[] | LectureInfo[] | CustomTimetableLectureInfo[],
) {
  return React.useMemo(() => (Array.from({ length: 5 }, (_, index) => {
    const currentDayInfo = [] as TimetableDayLectureInfo[];
    (myLectures ?? []).forEach((lecture, lectureIndex) => {
      let currentDayClassTimeArr: number[][] = [];
      let currentDayClassPlaceArr: string[] | undefined = [];
      if (!('code' in lecture)) {
        currentDayClassTimeArr = (lecture.class_time ?? [])
          .map((item) => (
            item
              .filter((time) => Math.floor(time / 100) === index)
              .map((time) => time % 100)
              .sort((a, b) => a - b)
          ));
        currentDayClassPlaceArr = lecture.class_place;
      } else if (lecture.class_time.includes(-1)) {
        const splitArray = (arr: number[]) => arr
          .reduce((result: number[][], value) => {
            if (value === -1) {
              result.push([]);
            } else {
              result[result.length - 1].push(value);
            }
            return result;
          }, [[]]);
        const outputArray = splitArray(lecture.class_time);
        currentDayClassTimeArr = (outputArray ?? []).map((item) => (
          item
            .filter((time) => Math.floor(time / 100) === index)
            .map((time) => time % 100)
            .sort((a, b) => a - b)
        ));
        currentDayClassPlaceArr = (lecture as TimetableLectureInfoV2).class_place?.split(', ');
      }
      // eslint-disable-next-line max-len
      const newClassTimeArr = currentDayClassTimeArr.reduce((result: TimetableDayLectureInfo[], value, currIdx) => {
        if (value[0] !== undefined) {
          result.push({
            id: -1,
            start: value[0],
            end: value[value.length - 1],
            name: 'name' in lecture ? lecture.name : lecture.class_title,
            lecture_class: '',
            professor: lecture.professor ?? '',
            class_place: ('class_place' in lecture && currentDayClassPlaceArr) ? currentDayClassPlaceArr[currIdx] : '',
            index: lectureIndex,
          });
        }
        return result;
      }, []);
      currentDayInfo.push(...newClassTimeArr);

      if (('code' in lecture) && (!lecture.class_time.includes(-1))) {
        const currentDayClassTime = (lecture.class_time ?? [])
          .filter((time) => Math.floor(time / 100) === index)
          .map((time) => time % 100)
          .sort((a, b) => a - b);
        if (currentDayClassTime.length) {
          const groups = currentDayClassTime.reduce((acc, curr, i) => {
            if (curr === currentDayClassTime[i]) {
              acc[acc.length - 1].push(curr);
            } else {
              acc.push([curr]);
            }
            return acc;
          }, [[currentDayClassTime[0]]]);
          const updatedCurrentDayInfo = groups.map((item) => ({
            id: lecture.id,
            start: item[0],
            end: item[item.length - 1],
            name: 'name' in lecture ? lecture.name : lecture.class_title,
            lecture_class: 'lecture_class' in lecture ? lecture.lecture_class : '',
            professor: lecture.professor ?? '',
            class_place: 'class_place' in lecture ? lecture.class_place : '',
            index: lectureIndex,
          }));
          currentDayInfo.push(...updatedCurrentDayInfo);
        }
      }
    });

    return currentDayInfo;
  })), [myLectures]);
}
