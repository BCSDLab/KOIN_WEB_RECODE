/* eslint-disable no-restricted-imports */
import ErrorBoundary from 'components/common/ErrorBoundary';
import LoadingSpinner from 'components/common/LoadingSpinner';
import React from 'react';
import { LectureInfo, TimetableLectureInfo } from 'interfaces/Lecture';
import LectureTable from '../common/LectureTable';
import styles from './DefaultPage.module.scss';

interface Props {
  myLectures: Array<LectureInfo> | Array<TimetableLectureInfo>;
  removeMyLectures: (clickedLecture: LectureInfo | TimetableLectureInfo) => void;
}

function MyLectureList({ myLectures, removeMyLectures } : Props) {
  return (
    <div>
      <h3 className={styles['page__title--sub']}>나의 시간표</h3>
      <div className={styles['page__table--selected']}>
        <ErrorBoundary fallbackClassName="loading">
          <React.Suspense fallback={<LoadingSpinner size="50" />}>
            <LectureTable
              height={300}
              list={myLectures}
              selectedLecture={undefined}
              onClickRow={undefined}
              onClickLastColumn={(clickedLecture) => { removeMyLectures(clickedLecture); }}
            >
              {(props: { onClick: () => void }) => (
                <button type="button" className={styles.list__button} onClick={props.onClick}>
                  <img src="https://static.koreatech.in/assets/img/ic-delete.png" alt="제거" />
                </button>
              )}
            </LectureTable>
          </React.Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
}

export default MyLectureList;
