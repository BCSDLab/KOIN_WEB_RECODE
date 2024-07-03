import ErrorBoundary from 'components/common/ErrorBoundary';
import LoadingSpinner from 'components/common/LoadingSpinner';
import { LectureInfo, TimetableLectureInfo } from 'interfaces/Lecture';
import React from 'react';
import useTimetableMutation from 'pages/Timetable/hooks/useTimetableMutation';
import { useSemester } from 'utils/zustand/semester';
import { useTempLecture } from 'utils/zustand/myTempLecture';
import useSelect from 'pages/Timetable/hooks/useSelect';
import showToast from 'utils/ts/showToast';
import useLectureList from 'pages/Timetable/hooks/useLectureList';
import useSearch from 'pages/Timetable/hooks/useSearch';
import useMyLectures from 'pages/Timetable/hooks/useMyLectures';
import LectureTable from 'components/TimetablePage/LectureTable';
import { useUser } from 'utils/hooks/useUser';
import DeptListbox from './DeptListbox';
import LastUpdatedDate from './LastUpdatedDate';
import styles from './LectureList.module.scss';

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
  const { tempLecture } = useTempLecture();
  const { setTempLecture } = useTempLecture();
  const { addMyLecture } = useTimetableMutation();
  const { data: userInfo } = useUser();
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
      myLectures={myLectures}
      selectedLecture={tempLecture ?? undefined}
      onHover={(hoveredLecture) => (
        hoveredLecture !== null && 'name' in hoveredLecture ? setTempLecture(hoveredLecture) : setTempLecture(null)
      )}
      onClickRow={
        (clickedLecture) => {
          if ('class_title' in clickedLecture) {
            return;
          }
          const myLectureTimeValue = (
            myLectures as Array<LectureInfo | TimetableLectureInfo>)
            .reduce((acc, cur) => acc.concat(cur.class_time), [] as number[]);

          if (clickedLecture.class_time.some((time) => myLectureTimeValue.includes(time))) {
            const myLectureList = myLectures as Array<LectureInfo & TimetableLectureInfo>;
            const alreadySelectedLecture = myLectureList.find(
              (lecture) => lecture.class_time.some(
                (time) => clickedLecture.class_time.includes(time),
              ),
            );
            if (!alreadySelectedLecture) {
              return;
            }
            if (userInfo) {
              showToast('error', `${alreadySelectedLecture.class_title}(${alreadySelectedLecture.lecture_class}) 강의가 중복되어 추가할 수 없습니다.`);
              return;
            }
            showToast('error', `${alreadySelectedLecture.name}(${alreadySelectedLecture.lecture_class}) 강의가 중복되어 추가할 수 없습니다.`);
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
