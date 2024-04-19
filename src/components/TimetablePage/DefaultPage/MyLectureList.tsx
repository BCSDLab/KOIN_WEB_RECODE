/* eslint-disable no-restricted-imports */
import ErrorBoundary from 'components/common/ErrorBoundary';
import LoadingSpinner from 'components/common/LoadingSpinner';
import React from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import useTokenState from 'utils/hooks/useTokenState';
import { myLectureRemoveLectureSelector, myLecturesAtom, selectedSemesterAtom } from 'utils/recoil/semester';
import useDeleteTimetableLecture from '../hooks/useDeleteTimetableLecture';
import useTimetableInfoList from '../hooks/useTimetableInfoList';
import LectureTable from '../common/LectureTable';
import styles from './DefaultPage.module.scss';

function MyLectureList() {
  const myLecturesValue = useRecoilValue(myLecturesAtom);
  const removeLectureFromLocalStorage = useSetRecoilState(myLectureRemoveLectureSelector);

  const selectedSemester = useRecoilValue(selectedSemesterAtom);
  const token = useTokenState();
  const { data: myLecturesFromServer } = useTimetableInfoList(selectedSemester, token);
  const { mutate: removeLectureFromServer } = useDeleteTimetableLecture(selectedSemester, token);

  return (

    <div>
      <h3 className={styles['page__title--sub']}>나의 시간표</h3>
      <div className={styles['page__table--selected']}>
        <ErrorBoundary fallbackClassName="loading">
          <React.Suspense fallback={<LoadingSpinner size="50" />}>
            {(myLecturesValue !== null || myLecturesFromServer !== undefined) ? (
              <LectureTable
                height={300}
                list={token ? (myLecturesFromServer ?? []) : (myLecturesValue ?? [])}
                selectedLecture={undefined}
                onClickRow={undefined}
                onClickLastColumn={
        (clickedLecture) => {
          if ('name' in clickedLecture) {
            removeLectureFromLocalStorage(clickedLecture);
            return;
          }
          removeLectureFromServer(clickedLecture.id.toString());
        }
      }
              >
                {(props: { onClick: () => void }) => (
                  <button type="button" className={styles.list__button} onClick={props.onClick}>
                    <img src="https://static.koreatech.in/assets/img/ic-delete.png" alt="제거" />
                  </button>
                )}
              </LectureTable>
            ) : (
              <LoadingSpinner size="50" />
            )}
          </React.Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
}

export default MyLectureList;
