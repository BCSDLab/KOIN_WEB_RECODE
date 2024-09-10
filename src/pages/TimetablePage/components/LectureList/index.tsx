import ErrorBoundary from 'components/common/ErrorBoundary';
import LoadingSpinner from 'components/common/LoadingSpinner';
import {
  LectureInfo,
  TimetableLectureInfoV2,
} from 'interfaces/Lecture';
import React from 'react';
import useTimetableV2Mutation from 'pages/TimetablePage/hooks/useTimetableV2Mutation';
import { useSemester, useSemesterAction } from 'utils/zustand/semester';
import useSelect from 'pages/TimetablePage/hooks/useSelect';
import showToast from 'utils/ts/showToast';
import useLectureList from 'pages/TimetablePage/hooks/useLectureList';
import useSearch from 'pages/TimetablePage/hooks/useSearch';
import LectureTable from 'components/TimetablePage/LectureTable';
import { useParams } from 'react-router-dom';
import useMyLecturesV2 from 'pages/TimetablePage/hooks/useMyLecturesV2';
import { useUser } from 'utils/hooks/state/useUser';
import { useTempLecture, useTempLectureAction } from 'utils/zustand/myTempLecture';
import ToggleButton from 'components/common/ToggleButton';
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

interface MyLectureListBoxProps {
  myLectures: Array<LectureInfo> | Array<TimetableLectureInfoV2>;
  frameId: number;
}

function CurrentSemesterLectureList({
  semesterKey,
  filter,
  myLecturesV2,
  frameId,
}: CurrentSemesterLectureListProps) {
  const { data: lectureList } = useLectureList(semesterKey);
  const tempLecture = useTempLecture();
  const { updateTempLecture } = useTempLectureAction();
  const { addMyLectureV2 } = useTimetableV2Mutation(frameId);
  const { data: userInfo } = useUser();

  return (
    <LectureTable
      frameId={Number(frameId)}
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
      myLecturesV2={myLecturesV2}
      selectedLecture={tempLecture ?? undefined}
      onClickRow={(clickedLecture) => ('code' in clickedLecture ? updateTempLecture(clickedLecture) : undefined)}
      onDoubleClickRow={
        (clickedLecture) => {
          const isContainedLecture = myLecturesV2.some(
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
        }
      }
      version="semesterLectureList"
    />
  );
}

function MyLectureListBox({ myLectures, frameId }: MyLectureListBoxProps) {
  return (
    <LectureTable
      frameId={frameId}
      list={myLectures}
      myLecturesV2={myLectures}
      selectedLecture={undefined}
      onClickRow={undefined}
      onDoubleClickRow={undefined}
      version="myLectureList"
    />
  );
}

function LectureList({ frameId }: { frameId: number }) {
  const semesterParams = useParams().id;
  const semester = useSemester();
  // 가장 최신연도와 월을 가져옴
  const mostRecentSemester = `${new Date().getFullYear()}${new Date().getMonth() > 5 ? 2 : 1}`;
  const { updateSemester } = useSemesterAction();
  if (semesterParams !== String(frameId)) {
    // ur에서 학기 정보를 가져오고 그것으로 store저장 만약 params가 없을 때, 가장 최근의 학기로 설정
    updateSemester(semesterParams || mostRecentSemester);
  }
  const {
    value: departmentFilterValue,
    onChangeSelect: onChangeDeptSelect,
  } = useSelect();
  const {
    onClickSearchButton, onKeyDownSearchInput, value: searchValue, searchInputRef,
  } = useSearch();
  const { myLecturesV2 } = useMyLecturesV2(frameId);
  const [isToggled, setIsToggled] = React.useState(false);

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
          {!isToggled
            ? (
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
            )
            : <MyLectureListBox myLectures={myLecturesV2} frameId={frameId} />}
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
