/* eslint-disable no-restricted-imports */
import ErrorBoundary from 'components/common/ErrorBoundary';
import LoadingSpinner from 'components/common/LoadingSpinner';
import React from 'react';
import LectureTable from '../../../components/TimetablePage/LectureTable';
import styles from '../DefaultPage/DefaultPage.module.scss';
import useTimetableMutation from '../hooks/useTimetableMutation';
import useMyLectures from '../hooks/useMyLectures';

function MyLectureList() {
  const { removeMyLecture } = useTimetableMutation();
  const { myLectures } = useMyLectures();
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
              onClickLastColumn={(clickedLecture) => { removeMyLecture(clickedLecture); }}
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
