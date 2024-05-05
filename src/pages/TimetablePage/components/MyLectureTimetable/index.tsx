/* eslint-disable no-restricted-imports */
import ErrorBoundary from 'components/common/ErrorBoundary';
import LoadingSpinner from 'components/common/LoadingSpinner';
import React from 'react';
import useImageDownload from 'utils/hooks/useImageDownload';
import { useRecoilValue } from 'recoil';
import { selectedTempLectureSelector } from 'utils/recoil/semester';
import useTimetableDayList from 'utils/hooks/useTimetableDayList';
import { useSemester } from 'utils/zustand/semester';
import styles from '../../DefaultPage/DefaultPage.module.scss';
import SemesterListbox from './SemesterListbox';
import Timetable from '../../../../components/TimetablePage/Timetable';
import useLectureList from '../../hooks/useLectureList';
import useMyLectures from '../../hooks/useMyLectures';

export default function MyLectureTimetable() {
  const { myLectures } = useMyLectures();

  const { onImageDownload: onTimetableImageDownload, divRef: timetableRef } = useImageDownload();
  const semester = useSemester();
  const selectedLecture = useRecoilValue(selectedTempLectureSelector);
  const { data: lectureList } = useLectureList(semester);
  const similarSelectedLecture = lectureList
    ?.filter((lecture) => lecture.code === selectedLecture?.code)
    ?? [];
  const selectedLectureIndex = similarSelectedLecture
    .findIndex(({ lecture_class }) => lecture_class === selectedLecture?.lecture_class);

  const similarSelectedLectureDayList = useTimetableDayList(similarSelectedLecture);
  const myLectureDayValue = useTimetableDayList(myLectures);

  return (
    <div className={styles['page__timetable-wrap']}>
      <div className={styles.page__filter}>
        <div className={styles.page__semester}>
          <SemesterListbox />
        </div>
        <button
          type="button"
          className={styles.page__button}
          onClick={() => onTimetableImageDownload('my-timetable')}
        >
          <img src="https://static.koreatech.in/assets/img/ic-image.png" alt="이미지" />
          이미지로 저장하기
        </button>
      </div>
      <div ref={timetableRef} className={styles.page__timetable}>
        <ErrorBoundary fallbackClassName="loading">
          <React.Suspense fallback={<LoadingSpinner size="50" />}>
            <Timetable
              lectures={myLectureDayValue}
              similarSelectedLecture={similarSelectedLectureDayList}
              selectedLectureIndex={selectedLectureIndex}
              columnWidth={55}
              firstColumnWidth={52}
              rowHeight={21}
              totalHeight={456}
            />
          </React.Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
}
