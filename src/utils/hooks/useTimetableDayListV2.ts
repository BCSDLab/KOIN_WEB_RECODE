import React from 'react';
import {
  LectureInfo,
  TimetableDayLectureInfo,
  TimetableLectureInfoV2,
} from 'interfaces/Lecture';

export default function useTimetableDayListV2(
  myLectures: TimetableLectureInfoV2 [] | LectureInfo[],
) {
  return React.useMemo(() => (Array.from({ length: 5 }, (_, index) => {
    const currentDayInfo = [] as TimetableDayLectureInfo[];
    (myLectures ?? []).forEach((lecture, lectureIndex) => {
      const currentDayClassTime = lecture.class_time
        .filter((time) => Math.floor(time / 100) === index)
        .map((time) => time % 100)
        .sort((a, b) => a - b);
      if (currentDayClassTime.length) {
        const groups = [];
        let currentGroup = [currentDayClassTime[0]];

        for (let i = 1; i < currentDayClassTime.length; i += 1) {
          if (currentDayClassTime[i] === currentDayClassTime[i - 1] + 1) {
            currentGroup.push(currentDayClassTime[i]);
          } else {
            groups.push(currentGroup);
            currentGroup = [currentDayClassTime[i]];
          }
        }

        groups.push(currentGroup);

        groups.forEach((item) => {
          currentDayInfo.push({
            id: 'id' in lecture ? lecture.id : 0,
            start: item[0],
            end: item[item.length - 1],
            name: 'name' in lecture ? lecture.name : lecture.class_title,
            lecture_class: lecture.lecture_class,
            professor: lecture.professor,
            index: lectureIndex,
          });
        });
      }
    });

    return currentDayInfo;
  })), [myLectures]);
}
