/* eslint-disable react/require-default-props */
/* eslint-disable no-restricted-imports */
import ErrorBoundary from 'components/common/ErrorBoundary';
import LoadingSpinner from 'components/common/LoadingSpinner';
import React from 'react';
import useImageDownload from 'utils/hooks/useImageDownload';
import { TimetableDayLectureInfo } from 'interfaces/Lecture';
import styles from './DefaultPage.module.scss';
import SemesterListbox from '../MyLectureTimetable/SemesterListbox';
import Timetable from '../MyLectureTimetable/Timetable';

interface Props {
  lectures: TimetableDayLectureInfo[][];
  selectedLectureIndex?: number;
  similarSelectedLecture?: TimetableDayLectureInfo[][];
}

export default function MyLectureTimetable(
  { lectures, similarSelectedLecture, selectedLectureIndex }: Props,
) {
  const { onImageDownload: onTimetableImageDownload, divRef: timetableRef } = useImageDownload();

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
              lectures={lectures}
              similarSelectedLecture={similarSelectedLecture}
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
