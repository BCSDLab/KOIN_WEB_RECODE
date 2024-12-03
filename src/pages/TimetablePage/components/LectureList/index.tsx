import ErrorBoundary from 'components/common/ErrorBoundary';
import LoadingSpinner from 'components/common/LoadingSpinner';
import { MyLectureInfo } from 'api/timetable/entity';
import React from 'react';
import useTimetableMutation from 'pages/TimetablePage/hooks/useTimetableMutation';
import { useSemester, useSemesterAction } from 'utils/zustand/semester';
import useSelect from 'pages/TimetablePage/hooks/useSelect';
import showToast from 'utils/ts/showToast';
import useLectureList from 'pages/TimetablePage/hooks/useLectureList';
import useSearch from 'pages/TimetablePage/hooks/useSearch';
import LectureTable, { LECTURE_TABLE_HEADER } from 'components/TimetablePage/LectureTable';
import { useParams } from 'react-router-dom';
import useMyLectures from 'pages/TimetablePage/hooks/useMyLectures';
import { useUser } from 'utils/hooks/state/useUser';
import { useTempLecture, useTempLectureAction } from 'utils/zustand/myTempLecture';
import ToggleButton from 'components/common/ToggleButton';
import useLogger from 'utils/hooks/analytics/useLogger';
import DeptListbox from './DeptListbox';
import LastUpdatedDate from './LastUpdatedDate';
import styles from './LectureList.module.scss';

interface CurrentSemesterLectureListProps {
  rowWidthList: number[];
  currentSemester: string;
  filter: {
    department: string;
    search: string;
  };
  myLectures: Array<MyLectureInfo>;
  frameId: number;
}

interface MyLectureListBoxProps {
  rowWidthList: number[];
  myLectures: Array<MyLectureInfo>;
  frameId: number;
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
  frameId,
}: CurrentSemesterLectureListProps) {
  const tempLecture = useTempLecture();
  const { data: userInfo } = useUser();
  const { data: lectureList } = useLectureList(currentSemester);
  const { updateTempLecture } = useTempLectureAction();
  const { addMyLecture } = useTimetableMutation(frameId);

  return (
    lectureList?.length !== 0 ? (
      <LectureTable
        rowWidthList={rowWidthList}
        frameId={frameId}
        list={(lectureList ?? []).filter((lecture) => {
          const searchFilter = filter.search.toUpperCase();
          const departmentFilter = filter.department;
          const searchCondition = lecture.name.toUpperCase().includes(searchFilter)
            || lecture.code.toUpperCase().includes(searchFilter)
            || lecture.professor.toUpperCase().includes(searchFilter);

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
        onClickRow={(clickedLecture) => ('class_time' in clickedLecture ? updateTempLecture(clickedLecture) : undefined)}
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
            const myLectureTimeValue = myLectures.flatMap((item) => (
              item.class_infos.flatMap((info) => info.class_time)
            ));

            if (
              clickedLecture.class_time.some((time: number) => myLectureTimeValue.includes(time))
            ) {
              const myLectureList = myLectures;
              const alreadySelectedLecture = myLectureList.find(
                (lecture) => lecture.class_infos.some((schedule) => (
                  schedule.class_time.some(
                    (time) => clickedLecture.class_time.includes(time),
                  )
                )),
              );
              if (!alreadySelectedLecture) {
                return;
              }
              if (userInfo) {
                if (alreadySelectedLecture.lecture_class) { // 분반이 존재하는 경우
                  showToast(
                    'error',
                    `${alreadySelectedLecture.class_title}(${alreadySelectedLecture.lecture_class}) 강의가 중복되어 추가할 수 없습니다.`,
                  );
                  return;
                }
                showToast( // 직접 강의를 추가하여 분반이 존재하지 않는 경우
                  'error',
                  `${alreadySelectedLecture.class_title} 강의가 중복되어 추가할 수 없습니다.`,
                );
                return;
              }
              showToast(
                'error',
                `${alreadySelectedLecture.class_title}(${alreadySelectedLecture.lecture_class}) 강의가 중복되어 추가할 수 없습니다.`,
              );
            } else {
              addMyLecture(clickedLecture);
            }
          }
        }
        version="semesterLectureList"
      />
    )
      : (
        <div className={styles['empty-list']}>
          강의 정보가 없습니다.
        </div>
      )
  );
}

function MyLectureListBox({ rowWidthList, myLectures, frameId }: MyLectureListBoxProps) {
  return (
    myLectures.length !== 0 ? (
      <LectureTable
        rowWidthList={rowWidthList}
        frameId={frameId}
        list={myLectures}
        myLectures={myLectures}
        selectedLecture={undefined}
        onClickRow={undefined}
        onDoubleClickRow={undefined}
        version="myLectureList"
      />
    ) : (
      <div className={styles['empty-list']}>
        현재 등록된 강의가 없습니다. 강의를 추가해 시간표를 완성해 보세요!
      </div>
    )
  );
}

function LectureList({ frameId }: { frameId: number }) {
  const logger = useLogger();

  const {
    onClickSearchButton,
    onKeyDownSearchInput,
    value: searchValue,
    searchInputRef,
  } = useSearch();
  const {
    value: departmentFilterValue,
    onChangeSelect: onChangeDeptSelect,
  } = useSelect();

  // 가장 최신연도와 월을 가져옴
  const semester = useSemester();
  const { updateSemester } = useSemesterAction();
  const mostRecentSemester = `${new Date().getFullYear()}${new Date().getMonth() > 5 ? 2 : 1}`;
  const semesterParams = useParams().id;
  if (semesterParams !== String(frameId)) {
    // ur에서 학기 정보를 가져오고 그것으로 store저장 만약 params가 없을 때, 가장 최근의 학기로 설정
    updateSemester(semesterParams || mostRecentSemester);
  }

  const { myLectures } = useMyLectures(frameId);

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
                actionTitle: 'USER',
                title: 'timetable',
                value: 'search',
              });
            }}
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
              frameId={frameId}
              currentSemester={semester}
              filter={{
                // 백엔드 수정하면 제거
                department: departmentFilterValue ?? '전체',
                search: searchValue ?? '',
              }}
              myLectures={myLectures as MyLectureInfo[]}
            />
          ) : (
            <MyLectureListBox
              rowWidthList={widthInfo}
              myLectures={myLectures as MyLectureInfo[]}
              frameId={frameId}
            />
          )}
        </React.Suspense>
      </ErrorBoundary>
      <div className={styles.page__foot}>
        <div className={styles.page__toggle}>
          <ToggleButton
            width="46"
            height="24"
            handleToggle={toggleLectureList}
          />
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
