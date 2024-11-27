import React from 'react';
import {
  TimetableDayLectureInfo,
} from 'interfaces/Lecture';
import { LectureInfo, LectureInfoV2 } from 'api/timetable/entity';

export default function useTimetableDayListV2(
  myLectures: Array<LectureInfo> | Array<LectureInfoV2>,
) {
  return React.useMemo(() => (Array.from({ length: 5 }, (_, index) => {
    const currentDayInfo = [] as TimetableDayLectureInfo[];
    (myLectures ?? []).forEach((lecture, lectureIndex) => {
      if ('class_infos' in lecture) {
        lecture.class_infos.forEach((schedule) => {
          const currentDayClassTime = (schedule.class_time ?? [])
            .filter((time) => Math.floor(time / 100) === index)
            .map((time) => time % 100)
            .sort((a, b) => a - b);
          if (currentDayClassTime.length) {
            const updatedCurrentDayInfo = [{
              id: lecture.id,
              start: currentDayClassTime[0],
              end: currentDayClassTime[currentDayClassTime.length - 1],
              name: lecture.class_title,
              lecture_class: lecture.lecture_class ?? '',
              professor: lecture.professor ?? '',
              class_place: schedule.class_place ?? '',
              index: lectureIndex,
            }];
            currentDayInfo.push(...updatedCurrentDayInfo);
          }
        });
      } else {
        const currentDayClassTime = (lecture.class_time ?? [])
          .filter((time) => Math.floor(time / 100) === index)
          .map((time) => time % 100)
          .sort((a, b) => a - b);
        if (currentDayClassTime.length) {
          const groups = currentDayClassTime.reduce((acc, curr, i) => {
            if (i === 0 || curr === currentDayClassTime[i - 1] + 1) {
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
            name: lecture.name,
            lecture_class: lecture.lecture_class ?? '',
            professor: lecture.professor ?? '',
            class_place: '', // null 값을 넣을 수도 있음
            index: lectureIndex,
          }));
          currentDayInfo.push(...updatedCurrentDayInfo);
        }
      }
    });

    return currentDayInfo;
  })), [myLectures]);
}
