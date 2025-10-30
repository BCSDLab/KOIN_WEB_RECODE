import React from 'react';
import { Lecture, MyLectureInfo, Semester, LectureInfo } from 'api/timetable/entity';
import ErrorBoundary from 'components/boundary/ErrorBoundary';
import LoadingSpinner from 'components/feedback/LoadingSpinner';
import LectureTable, { LECTURE_TABLE_HEADER } from 'components/TimetablePage/components/LectureTable';
import ToggleButton from 'components/TimetablePage/components/ToggleButton';
import useLectureList from 'components/TimetablePage/hooks/useLectureList';
import useMyLectures from 'components/TimetablePage/hooks/useMyLectures';
import useSearch from 'components/TimetablePage/hooks/useSearch';
import useSelect from 'components/TimetablePage/hooks/useSelect';
import useTimetableMutation from 'components/TimetablePage/hooks/useTimetableMutation';
import useLogger from 'utils/hooks/analytics/useLogger';
import { useUser } from 'utils/hooks/state/useUser';
import showToast from 'utils/ts/showToast';
import { useTempLecture, useTempLectureAction } from 'utils/zustand/myTempLecture';
import { useSemester } from 'utils/zustand/semester';
import DeptListbox from './DeptListbox';
import LastUpdatedDate from './LastUpdatedDate';
import styles from './LectureList.module.scss';

interface CurrentSemesterLectureListProps {
  rowWidthList: number[];
  currentSemester: Semester;
  filter: {
    department: string;
    search: string;
  };
  myLectures: Array<MyLectureInfo>;
  timetableFrameId: number;
}

interface MyLectureListBoxProps {
  rowWidthList: number[];
  myLectures: Array<MyLectureInfo>;
  timetableFrameId: number;
}

const useFlexibleWidth = (length: number, initialValue: number[]) => {
  const [widthInfo] = React.useState(() => initialValue);
  // TODO: flexible width 생성(mouseMove 이벤트)
  return {
    widthInfo,
  };
};

function CurrentSemesterLectureList({
  rowWidthList,
  currentSemester,
  filter,
  myLectures,
  timetableFrameId,
}: CurrentSemesterLectureListProps) {
  const tempLecture = useTempLecture();
  const { data: userInfo } = useUser();
  const { data: lectureList } = useLectureList(currentSemester);
  const { updateTempLecture } = useTempLectureAction();
  const { addMyLecture } = useTimetableMutation(timetableFrameId);

  const isOverlapping = (selected: LectureInfo, existing: LectureInfo) => {
    if (selected.day !== existing.day) {
      return false;
    }
    if (
      (selected.start_time >= existing.start_time && selected.start_time <= existing.end_time) ||
      (selected.end_time >= existing.start_time && selected.end_time <= existing.end_time) ||
      (selected.start_time <= existing.start_time && selected.end_time >= existing.end_time)
    ) {
      return true;
    }

    return false;
  };
  const findOverlappingLecture = (myLecturess: MyLectureInfo[], clickedLecture: Lecture) => {
    const overlappingLecture = myLecturess.find((myLecture) =>
      myLecture.lecture_infos.some((myLectureInfo) =>
        clickedLecture.lecture_infos.some((clickedLectureInfo) => isOverlapping(clickedLectureInfo, myLectureInfo)),
      ),
    );
    return overlappingLecture;
  };

  return lectureList?.length !== 0 ? (
    <LectureTable
      rowWidthList={rowWidthList}
      timetableFrameId={timetableFrameId}
      list={(lectureList ?? []).filter((lecture) => {
        const searchFilter = filter.search.toUpperCase();
        const departmentFilter = filter.department;
        const searchCondition =
          lecture.name.toUpperCase().includes(searchFilter) ||
          lecture.code.toUpperCase().includes(searchFilter) ||
          lecture.professor.toUpperCase().includes(searchFilter);

        if (searchFilter !== '' && departmentFilter !== '전체') {
          return searchCondition && lecture.department === departmentFilter;
        }
        if (searchFilter !== '') {
          return searchCondition;
        }
        if (departmentFilter !== '전체') {
          return lecture.department === departmentFilter;
        }

        return true;
      })}
      myLectures={myLectures}
      selectedLecture={tempLecture ?? undefined}
      onClickRow={(clickedLecture) => ('lecture_id' in clickedLecture ? undefined : updateTempLecture(clickedLecture))}
      onDoubleClickRow={(clickedLecture) => {
        if ('lecture_id' in clickedLecture) {
          return;
        }
        if (!myLectures) {
          addMyLecture(clickedLecture);
          return;
        }
        const isContainedLecture = myLectures.some(
          (lecture) => lecture.code === clickedLecture.code && lecture.lecture_class === clickedLecture.lecture_class,
        );
        if (isContainedLecture) {
          showToast('error', '동일한 과목이 이미 추가되어 있습니다.');
          return;
        }
        const overlappingLecture = findOverlappingLecture(myLectures, clickedLecture);
        if (overlappingLecture) {
          const alreadySelectedLectureName =
            'name' in overlappingLecture ? overlappingLecture.name : overlappingLecture.class_title;
          if (userInfo) {
            if (overlappingLecture.lecture_class) {
              // 분반이 존재하는 경우
              showToast(
                'error',
                `${alreadySelectedLectureName}(${overlappingLecture.lecture_class}) 강의가 중복되어 추가할 수 없습니다.`,
              );
              return;
            }
            showToast(
              // 직접 강의를 추가하여 분반이 존재하지 않는 경우
              'error',
              `${alreadySelectedLectureName} 강의가 중복되어 추가할 수 없습니다.`,
            );
            return;
          }
          showToast(
            'error',
            `${alreadySelectedLectureName}(${overlappingLecture.lecture_class}) 강의가 중복되어 추가할 수 없습니다.`,
          );
        } else {
          addMyLecture(clickedLecture);
        }
      }}
      version="semesterLectureList"
    />
  ) : (
    <div className={styles['empty-list']}>강의 정보가 없습니다.</div>
  );
}

function MyLectureListBox({ rowWidthList, myLectures, timetableFrameId }: MyLectureListBoxProps) {
  return myLectures.length !== 0 ? (
    <LectureTable
      rowWidthList={rowWidthList}
      timetableFrameId={timetableFrameId}
      list={myLectures}
      myLectures={myLectures}
      selectedLecture={undefined}
      onClickRow={undefined}
      onDoubleClickRow={undefined}
      version="myLectureList"
    />
  ) : (
    <div className={styles['empty-list']}>현재 등록된 강의가 없습니다. 강의를 추가해 시간표를 완성해 보세요!</div>
  );
}

function LectureList({ timetableFrameId }: { timetableFrameId: number }) {
  const logger = useLogger();

  const { onClickSearchButton, onKeyDownSearchInput, value: searchValue, searchInputRef } = useSearch();
  const { value: departmentFilterValue, onChangeSelect: onChangeDeptSelect } = useSelect();

  // 가장 최신연도와 월을 가져옴
  const semester = useSemester();

  const { myLectures } = useMyLectures(timetableFrameId);

  const [isToggled, setIsToggled] = React.useState(false);
  const { widthInfo } = useFlexibleWidth(9, [61, 173, 41, 61, 61, 41, 41, 41, 61]);

  const toggleLectureList = () => {
    setIsToggled((prev) => !prev);
  };

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
            onClick={() => {
              onClickSearchButton();
              logger.actionEventClick({
                team: 'USER',
                event_label: 'timetable',
                value: 'search',
              });
            }}
          >
            <img src="https://static.koreatech.in/assets/img/ic-search-gray.png" alt="search" />
          </button>
        </div>
        <div className={styles.page__depart}>
          <React.Suspense fallback={<LoadingSpinner size="50" />}>
            <DeptListbox value={departmentFilterValue} onChange={onChangeDeptSelect} isWhiteBackground={false} />
          </React.Suspense>
        </div>
      </div>
      <div className={styles.table__header} role="row">
        {LECTURE_TABLE_HEADER.map((header, headerIndex) => (
          <div
            style={{
              width: `${widthInfo[headerIndex]}px`,
            }}
            className={styles.table__col}
            role="columnheader"
            key={header.key}
          >
            {header.label}
            {/* 내림차순 기능 추가할때 다시 복구 */}
            {/* {headerIndex !== LECTURE_TABLE_HEADER.length - 1 && (
            <>
              <button type="button" className={styles.table__button}>
                <img src="https://static.koreatech.in/assets/img/ic-arrow-down.png" alt="내림차순" />
              </button>
              <div className={styles.table__resize} aria-hidden />
            </>
          )} */}
          </div>
        ))}
      </div>
      <ErrorBoundary fallbackClassName="loading">
        <React.Suspense fallback={<LoadingSpinner size="50" />}>
          {!isToggled ? (
            <CurrentSemesterLectureList
              rowWidthList={widthInfo}
              timetableFrameId={timetableFrameId}
              currentSemester={semester}
              filter={{
                // 백엔드 수정하면 제거
                department: departmentFilterValue ?? '전체',
                search: searchValue ?? '',
              }}
              myLectures={(myLectures ?? []) as MyLectureInfo[]}
            />
          ) : (
            <MyLectureListBox
              rowWidthList={widthInfo}
              myLectures={(myLectures ?? []) as MyLectureInfo[]}
              timetableFrameId={timetableFrameId}
            />
          )}
        </React.Suspense>
      </ErrorBoundary>
      <div className={styles.page__foot}>
        <div className={styles.page__toggle}>
          <ToggleButton width="46" height="24" handleToggle={toggleLectureList} />
          <div>시간표에 추가한 과목</div>
        </div>
        <ErrorBoundary fallbackClassName="loading">
          <React.Suspense fallback={<LoadingSpinner size="50" />}>
            <LastUpdatedDate />
          </React.Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
}

export default LectureList;
