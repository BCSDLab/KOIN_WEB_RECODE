import React from 'react';
import {
  LectureInfo,
  TimetableDayLectureInfo,
  TimetableLectureInfo,
} from 'interfaces/Lecture';

export default function useTimetableDayList(myLectures: LectureInfo[] | TimetableLectureInfo[]) {
  return React.useMemo(() => (Array.from({ length: 5 }, (_, index) => {
    const currentDayInfo = [] as TimetableDayLectureInfo[];
    (myLectures ?? []).forEach((lecture, lectureIndex) => {
      const currentDayClassTime = lecture.class_time
        .filter((time) => Math.floor(time / 100) === index)
        .map((time) => time % 100)
        .sort((a, b) => a - b);

      if (currentDayClassTime.length) {
        currentDayInfo.push({
          start: currentDayClassTime[0],
          end: currentDayClassTime[currentDayClassTime.length - 1],
          name: 'name' in lecture ? lecture.name : lecture.class_title,
          lecture_class: lecture.lecture_class,
          professor: lecture.professor,
          index: lectureIndex,
        });
      }
    });

    return currentDayInfo;
  })), [myLectures]);
}
