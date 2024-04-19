/* eslint-disable no-restricted-imports */
import ErrorBoundary from 'components/common/ErrorBoundary';
import LoadingSpinner from 'components/common/LoadingSpinner';
import { LectureInfo, TimetableLectureInfo } from 'interfaces/Lecture';
import React from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import useTokenState from 'utils/hooks/useTokenState';
import {
  myLectureAddLectureSelector, selectedSemesterAtom, selectedTempLectureSelector,
} from 'utils/recoil/semester';
import showToast from 'utils/ts/showToast';
import useAddTimetableLecture from '../hooks/useAddTimetableLecture';
import useLectureList from '../hooks/useLectureList';
import { useSelect, useSelectRecoil } from '../hooks/useSelect';
import DeptListbox from '../LectureList/DeptListbox ';
import LastUpdatedDate from '../LectureList/LastUpdatedDate';
import styles from './DefaultPage.module.scss';
import useSearch from '../hooks/useSearch';
import LectureTable from '../common/LectureTable';

interface CurrentSemesterLectureListProps {
  semesterKey: string | null;
  filter: {
    department: string;
    search: string;
  };
  myLectures: Array<LectureInfo> | Array<TimetableLectureInfo>;
}

function CurrentSemesterLectureList({
  semesterKey,
  filter,
  myLectures,
}: CurrentSemesterLectureListProps) {
  const { data: lectureList, status } = useLectureList(semesterKey);
  const [selectedTempLecture, setSelectedTempLecture] = useRecoilState(selectedTempLectureSelector);
  const selectedSemester = useRecoilValue(selectedSemesterAtom);
  const addLectureToLocalStorage = useSetRecoilState(myLectureAddLectureSelector);

  const token = useTokenState();
  const { mutate: mutateAddWithServer } = useAddTimetableLecture(token);
  const isLoaded = status === 'success' && myLectures;

  return (
    isLoaded ? (
      <LectureTable
        height={459}
        list={
          (lectureList as unknown as Array<LectureInfo>)
            .filter((lecture) => {
              const searchFilter = filter.search.toUpperCase();
              const departmentFilter = filter.department;

              if (searchFilter !== '' && departmentFilter !== '전체') {
                return lecture.name.toUpperCase().includes(searchFilter)
                  && lecture.department === departmentFilter;
              }
              if (searchFilter !== '') {
                return lecture.name.toUpperCase().includes(searchFilter);
              }
              if (departmentFilter !== '전체') {
                return lecture.department === departmentFilter;
              }

              return true;
            })
        }
        selectedLecture={selectedTempLecture ?? undefined}
        onClickRow={(clickedLecture) => ('name' in clickedLecture ? setSelectedTempLecture(clickedLecture) : undefined)}
        onClickLastColumn={
          (clickedLecture) => {
            if ('class_title' in clickedLecture) {
              return;
            }
            const myLectureTimeValue = (
              myLectures as Array<LectureInfo | TimetableLectureInfo>)
              .reduce((acc, cur) => acc.concat(cur.class_time), [] as number[]);
            if (clickedLecture.class_time.some((time) => myLectureTimeValue.includes(time))) {
              showToast('error', '시간이 중복되어 추가할 수 없습니다.');
              return;
            }
            if (token) {
              mutateAddWithServer({
                semester: selectedSemester,
                timetable: [{ class_title: clickedLecture.name, ...clickedLecture }],
              });
            } else {
              addLectureToLocalStorage(clickedLecture);
            }
          }
        }
      >
        {(props: { onClick: () => void }) => (
          <button type="button" className={styles.list__button} onClick={props.onClick}>
            <img src="https://static.koreatech.in/assets/img/ic-add.png" alt="추가" />
          </button>
        )}
      </LectureTable>
    ) : (
      <LoadingSpinner size="50" />
    )
  );
}

function LectureList({ myLectures }:
{ myLectures: Array<LectureInfo> | Array<TimetableLectureInfo> }) {
  const {
    value: departmentFilterValue,
    onChangeSelect: onChangeDeptSelect,
  } = useSelect();
  const {
    onClickSearchButton, onKeyDownSearchInput, value: searchValue, searchInputRef,
  } = useSearch();

  const { value: semesterFilterValue } = useSelectRecoil(selectedSemesterAtom);

  return (
    <div>
      <div className={styles.page__filter}>
        <div className={styles['search-input']}>
          <input
            ref={searchInputRef}
            className={styles['search-input__input']}
            placeholder="교과명을 입력하세요."
            onKeyDown={onKeyDownSearchInput}
          />
          <button
            className={styles['search-input__button']}
            type="button"
            onClick={onClickSearchButton}
          >
            <img src="https://static.koreatech.in/assets/img/ic-search-gray.png" alt="search" />
          </button>
        </div>
        <div className={styles.page__depart}>
          <React.Suspense fallback={<LoadingSpinner size="50" />}>
            <DeptListbox
              value={departmentFilterValue}
              onChange={onChangeDeptSelect}
            />
          </React.Suspense>
        </div>
      </div>

      <ErrorBoundary fallbackClassName="loading">
        <React.Suspense fallback={<LoadingSpinner size="50" />}>
          <CurrentSemesterLectureList
            semesterKey={semesterFilterValue}
            filter={{
              // 백엔드 수정하면 제거
              department: departmentFilterValue ?? '전체',
              search: searchValue ?? '',
            }}
            myLectures={myLectures}
          />
        </React.Suspense>
      </ErrorBoundary>
      <ErrorBoundary fallbackClassName="loading">
        <React.Suspense fallback={<LoadingSpinner size="50" />}>
          <LastUpdatedDate />
        </React.Suspense>
      </ErrorBoundary>
    </div>
  );
}

export default LectureList;
