/* eslint-disable no-restricted-imports */
import ErrorBoundary from 'components/common/ErrorBoundary';
import LoadingSpinner from 'components/common/LoadingSpinner';
import React from 'react';
import useImageDownload from 'utils/hooks/useImageDownload';
import SemesterListbox from '../MyLectureTimetable/SemesterListbox';
import CurrentSemesterTimetable from '../MyLectureTimetable/CurrentSemesterTable';
import styles from './DefaultPage.module.scss';

export default function MyLectureTimetable() {
  const { onImageDownload: onTimetableImageDownload, divRef: timetableRef } = useImageDownload();
  return (
    <div className={styles['page__timetable-wrap']}>
      <div className={styles.page__filter}>
        <div className={styles.page__semester}>
          <React.Suspense fallback={<LoadingSpinner size="50" />}>
            <SemesterListbox />
          </React.Suspense>
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
            <CurrentSemesterTimetable />
          </React.Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
}
