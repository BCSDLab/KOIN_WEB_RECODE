/* eslint-disable no-restricted-imports */
import ErrorBoundary from 'components/common/ErrorBoundary';
import LoadingSpinner from 'components/common/LoadingSpinner';
import { LectureInfo, TimetableLectureInfo } from 'interfaces/Lecture';
import React from 'react';
import useTimetableMutation from 'pages/Timetable/hooks/useTimetableMutation';
import { useSemester } from 'utils/zustand/semester';
import { useTempLecture, useTempLectureAction } from 'utils/zustand/myTempLecture';
import useSelect from 'pages/Timetable/hooks/useSelect';
import showToast from 'utils/ts/showToast';
import useLectureList from 'pages/Timetable/hooks/useLectureList';
import DeptListbox from './DeptListbox ';
import LastUpdatedDate from './LastUpdatedDate';
import styles from './LectureList.module.scss';
import useSearch from '../../hooks/useSearch';
import LectureTable from '../../../../components/TimetablePage/LectureTable';
import useMyLectures from '../../hooks/useMyLectures';

interface CurrentSemesterLectureListProps {
  semesterKey: string;
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
  const { data: lectureList } = useLectureList(semesterKey);
  const tempLecture = useTempLecture();
  const { updateTempLecture } = useTempLectureAction();
  const { addMyLecture } = useTimetableMutation();

  return (
    <LectureTable
      height={612}
      list={
        (lectureList ?? [])
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
      selectedLecture={tempLecture ?? undefined}
      onClickRow={(clickedLecture) => ('name' in clickedLecture ? updateTempLecture(clickedLecture) : undefined)}
      onDoubleClickRow={
        (clickedLecture) => {
          const isContainedLecture = myLectures.some(
            (lecture) => lecture.code === clickedLecture.code
            && lecture.lecture_class === clickedLecture.lecture_class,
          );
          if ('class_title' in clickedLecture) {
            return;
          }
          if (isContainedLecture) {
            showToast('error', '동일한 과목이 이미 추가되어 있습니다.');
            return;
          }
          const myLectureTimeValue = (
            myLectures as Array<LectureInfo | TimetableLectureInfo>)
            .reduce((acc, cur) => acc.concat(cur.class_time), [] as number[]);

          if (clickedLecture.class_time.some((time) => myLectureTimeValue.includes(time))) {
            showToast('error', '시간이 중복되어 추가할 수 없습니다.');
          } else {
            addMyLecture(clickedLecture);
          }
        }
      }
    />
  );
}

function LectureList() {
  const {
    value: departmentFilterValue,
    onChangeSelect: onChangeDeptSelect,
  } = useSelect();
  const {
    onClickSearchButton, onKeyDownSearchInput, value: searchValue, searchInputRef,
  } = useSearch();
  const semester = useSemester();
  const { myLectures } = useMyLectures();

  return (
    <div className={styles.page}>
      <div className={styles.page__filter}>
        <div className={styles['search-input']}>
          <input
            ref={searchInputRef}
            className={styles['search-input__input']}
            placeholder="검색어를 입력해주세요."
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
            semesterKey={semester}
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
