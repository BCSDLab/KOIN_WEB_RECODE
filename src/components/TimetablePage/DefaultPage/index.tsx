/* eslint-disable no-restricted-imports */
import React from 'react';
import ErrorBoundary from 'components/common/ErrorBoundary';
import { ReactComponent as LoadingSpinner } from 'assets/svg/loading-spinner.svg';
import useImageDownload from 'utils/hooks/useImageDownload';
import styles from './DefaultPage.module.scss';
import CurrentMyLectureList from './CurrentMyLectureList';
import CurrentSemesterTimetable from './CurrentSemesterTable';
import Curriculum from './Curriculum';
import SemesterLectureTable from './SemesterLectureTable';
import SemesterListbox from '../SemesterLectureTable/SemesterListbox';

function DefaultPage() {
  const { onImageDownload: onTimetableImageDownload, divRef: timetableRef } = useImageDownload();

  return (
    <>
      <h1 className={styles.page__title}>시간표</h1>
      <div className={styles.page__content}>
        <SemesterLectureTable />
        <div className={styles['page__timetable-wrap']}>
          <div className={styles.page__filter}>
            <div className={styles.page__semester}>
              <React.Suspense fallback={<LoadingSpinner className={styles['dropdown-loading-spinner']} />}>
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
              <React.Suspense fallback={<LoadingSpinner className={styles['top-loading-spinner']} />}>
                <CurrentSemesterTimetable />
              </React.Suspense>
            </ErrorBoundary>
          </div>
        </div>

        <div>
          <h3 className={styles['page__title--sub']}>나의 시간표</h3>
          <div className={styles['page__table--selected']}>
            <ErrorBoundary fallbackClassName="loading">
              <React.Suspense fallback={<LoadingSpinner className={styles['bottom-loading-spinner']} />}>
                <CurrentMyLectureList />
              </React.Suspense>
            </ErrorBoundary>
          </div>
        </div>
        <div>
          <h3 className={styles['page__title--sub']}>커리큘럼</h3>
          <ErrorBoundary fallbackClassName="loading">
            <React.Suspense fallback={<LoadingSpinner className={styles['bottom-loading-spinner']} />}>
              <Curriculum />
            </React.Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </>
  );
}

export { DefaultPage };
