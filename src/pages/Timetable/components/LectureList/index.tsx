import ErrorBoundary from 'components/common/ErrorBoundary';
import LoadingSpinner from 'components/common/LoadingSpinner';
import {
  LectureInfo,
  TimetableLectureInfoV2,
} from 'interfaces/Lecture';
import React from 'react';
import useTimetableV2Mutation from 'pages/Timetable/hooks/useTimetableV2Mutation';
import { useSemester, useSemesterAction } from 'utils/zustand/semester';
import useSelect from 'pages/Timetable/hooks/useSelect';
import showToast from 'utils/ts/showToast';
import useLectureList from 'pages/Timetable/hooks/useLectureList';
import useSearch from 'pages/Timetable/hooks/useSearch';
import LectureTable from 'components/TimetablePage/LectureTable';
import { useUser } from 'utils/hooks/useUser';
import { useParams } from 'react-router-dom';
import useMyLecturesV2 from 'pages/Timetable/hooks/useMyLecturesV2';
import { useTempLectureAction } from 'utils/zustand/myTempLectureV2';
import DeptListbox from './DeptListbox';
import LastUpdatedDate from './LastUpdatedDate';
import styles from './LectureList.module.scss';

interface CurrentSemesterLectureListProps {
  semesterKey: string;
  filter: {
    department: string;
    search: string;
  };
  myLecturesV2: Array<LectureInfo> | Array<TimetableLectureInfoV2>;
  frameId: number;
}

function CurrentSemesterLectureList({
  semesterKey,
  filter,
  myLecturesV2,
  frameId,
}: CurrentSemesterLectureListProps) {
  const { data: lectureList } = useLectureList(semesterKey);
  const { updateTempLecture } = useTempLectureAction();
  const { addMyLectureV2 } = useTimetableV2Mutation(frameId);
  const { data: userInfo } = useUser();
  return (
    <LectureTable
      height={612}
      list={(lectureList ?? []).filter((lecture) => {
        const searchFilter = filter.search.toUpperCase();
        const departmentFilter = filter.department;

        if (searchFilter !== '' && departmentFilter !== '전체') {
          return (
            lecture.name.toUpperCase().includes(searchFilter)
            && lecture.department === departmentFilter
          );
        }
        if (searchFilter !== '') {
          return lecture.name.toUpperCase().includes(searchFilter);
        }
        if (departmentFilter !== '전체') {
          return lecture.department === departmentFilter;
        }

        return true;
      })}
      myLecturesV2={myLecturesV2}
      onHover={(hoveredLecture) => (hoveredLecture !== null && 'name' in hoveredLecture
        ? updateTempLecture(hoveredLecture)
        : updateTempLecture(null))}
      onClickRow={(clickedLecture) => {
        if (('class_title' in clickedLecture)) {
          return;
        }
        const myLectureTimeValue = (
          myLecturesV2 as Array<LectureInfo | TimetableLectureInfoV2>
        ).reduce((acc, cur) => {
          if (cur.class_time) {
            return acc.concat(cur.class_time);
          }
          return acc;
        }, [] as number[]);

        if (
          clickedLecture.class_time.some((time) => myLectureTimeValue.includes(time))
        ) {
          const myLectureList = myLecturesV2 as Array<
          LectureInfo & TimetableLectureInfoV2
          >;
          const alreadySelectedLecture = myLectureList.find(
            (lecture) => lecture.class_time.some(
              (time) => clickedLecture.class_time.includes(time),
            ),
          );
          if (!alreadySelectedLecture) {
            return;
          }
          if (userInfo) {
            showToast(
              'error',
              `${alreadySelectedLecture.class_title}(${alreadySelectedLecture.lecture_class}) 강의가 중복되어 추가할 수 없습니다.`,
            );
            return;
          }
          showToast(
            'error',
            `${alreadySelectedLecture.class_title}(${alreadySelectedLecture.lecture_class}) 강의가 중복되어 추가할 수 없습니다.`,
          );
        } else {
          addMyLectureV2(clickedLecture);
        }
      }}
    />
  );
}

function LectureList({ frameId }: { frameId: number }) {
  const semesterParams = useParams().semester;

  const {
    value: departmentFilterValue,
    onChangeSelect: onChangeDeptSelect,
  } = useSelect();
  const {
    onClickSearchButton, onKeyDownSearchInput, value: searchValue, searchInputRef,
  } = useSearch();
  const semester = useSemester();
  const { updateSemester } = useSemesterAction();
  updateSemester(semesterParams || '20241');
  // ur에서 학기 정보를 가져오고 그것으로 store저장 만약 params가 없을 때, 가장 최근의 학기로 설정

  const { myLecturesV2 } = useMyLecturesV2(frameId);

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
            <img
              src="https://static.koreatech.in/assets/img/ic-search-gray.png"
              alt="search"
            />
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
            frameId={frameId}
            semesterKey={semester}
            filter={{
              // 백엔드 수정하면 제거
              department: departmentFilterValue ?? '전체',
              search: searchValue ?? '',
            }}
            myLecturesV2={myLecturesV2}
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
