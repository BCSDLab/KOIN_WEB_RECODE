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
        const classTimeResult: number[][] = [];
        let subClassTimeArr: number[] = [];
        lecture.class_time.forEach((item, idx) => {
          if (idx === lecture.class_time.length - 1) return;
          if (item === -1) {
            classTimeResult.push(subClassTimeArr);
            subClassTimeArr = [];
          } else {
            subClassTimeArr.push(item);
          }
        });
        classTimeResult.push(subClassTimeArr);
        currentDayClassTimeArr = (classTimeResult ?? []).map((item) => (
          item
            .filter((time) => Math.floor(time / 100) === index)
            .map((time) => time % 100)
            .sort((a, b) => a - b)
        ));
        currentDayClassPlaceArr = (lecture as TimetableLectureInfoV2).class_place?.split(', ');
      }
      currentDayClassTimeArr.forEach((item, idx) => {
        const groups: number[][] = [];
        let currentGroup = [item[0]];
        for (let i = 1; i < item.length; i += 1) {
          if (item[i] === item[i - 1] + 1) {
            currentGroup.push(item[i]);
          } else {
            groups.push(currentGroup);
            currentGroup = [item[i]];
          }
        }
        groups.push(currentGroup);
        groups.forEach((list) => {
          if (list[0] !== undefined) {
            currentDayInfo.push({
              id: 0,
              start: list[0],
              end: list[list.length - 1],
              name: 'name' in lecture ? lecture.name : lecture.class_title,
              lecture_class: '',
              professor: lecture.professor ?? '',
              class_place: ('class_place' in lecture && currentDayClassPlaceArr) ? currentDayClassPlaceArr[idx] : '',
              index: lectureIndex,
            });
          }
        });
      });
      if (('code' in lecture) && (!lecture.class_time.includes(-1))) {
        const currentDayClassTime = (lecture.class_time ?? [])
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
              id: lecture.id,
              start: item[0],
              end: item[item.length - 1],
              name: 'name' in lecture ? lecture.name : lecture.class_title,
              lecture_class: 'lecture_class' in lecture ? lecture.lecture_class : '',
              professor: lecture.professor ?? '',
              class_place: 'class_place' in lecture ? lecture.class_place : '',
              index: lectureIndex,
            });
          });
        }
      }
    });

    return currentDayInfo;
  })), [myLectures]);
}
