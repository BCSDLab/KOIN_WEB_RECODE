import { cn } from '@bcsdlab/utils';
import ErrorBoundary from 'components/common/ErrorBoundary';
import LoadingSpinner from 'components/common/LoadingSpinner';
import Timetable from 'components/TimetablePage/Timetable';
import TimetableHeader from 'pages/Timetable/components/TimetableHeader';
import useLectureList from 'pages/Timetable/hooks/useLectureList';
import useMyLectures from 'pages/Timetable/hooks/useMyLectures';
import React, { Suspense, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useTimetableDayList from 'utils/hooks/useTimetableDayList';
import { useTempLecture } from 'utils/zustand/myTempLecture';
import { useSemester } from 'utils/zustand/semester';
import { ReactComponent as TrashCanIcon } from 'assets/svg/trash-can-icon.svg';
import { ReactComponent as PenIcon } from 'assets/svg/pen-icon.svg';
import styles from './DefaultPage.module.scss';

export default function DefaultPage() {
  const navigate = useNavigate();
  const [selectedCourseType, setSelectedCourseType] = useState('regular');
  const isRegularCourseSelected = selectedCourseType === 'regular';

  const { myLectures } = useMyLectures();
  const semester = useSemester();
  const tempLecture = useTempLecture();
  const { data: lectureList } = useLectureList(semester);
  const similarSelectedLecture = lectureList
    ?.filter((lecture) => lecture.code === tempLecture?.code)
    ?? [];
  const selectedLectureIndex = similarSelectedLecture
    .findIndex(({ lecture_class }) => lecture_class === tempLecture?.lecture_class);

  const similarSelectedLectureDayList = useTimetableDayList(similarSelectedLecture);
  const myLectureDayValue = useTimetableDayList(myLectures);

  const handleCourseClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { value: courseType } = e.currentTarget;
    setSelectedCourseType(courseType);
    navigate(`/timetable/modify/${courseType}`);
  };
  return (
    <div className={styles.page}>
      <TimetableHeader />
      <Suspense fallback={(
        <div className={styles['central-loading-spinner']}><LoadingSpinner size="100" /></div>
      )}
      >
        <div className={styles.page__content}>
          <div>
            <div className={styles['page__button-group']}>
              <button
                type="button"
                className={cn({
                  [styles['page__regular-course-button']]: true,
                  [styles['page__regular-course-button--active']]: isRegularCourseSelected,
                  [styles['page__regular-course-button--inactive']]: !isRegularCourseSelected,
                })}
                value="regular"
                onClick={handleCourseClick}
                disabled={isRegularCourseSelected}
              >
                정규 과목
              </button>
              <button
                type="button"
                className={cn({
                  [styles['page__directly-add-button']]: true,
                  [styles['page__directly-add-button--active']]: !isRegularCourseSelected,
                  [styles['page__directly-add-button--inactive']]: isRegularCourseSelected,
                })}
                value="direct"
                onClick={handleCourseClick}
                disabled={!isRegularCourseSelected}
              >
                직접 추가
              </button>
            </div>
            {/* TODO: 직접 추가 UI, 강의 리스트 UI 추가 */}
            {isRegularCourseSelected ? (
              <div>강의 리스트</div>
            ) : (
              <div>직접 추가 UI</div>
            )}
          </div>
          <div className={styles.page__timetable}>
            <div className={styles['page__timetable-button-group']}>
              <button type="button" className={styles['page__delete-button']}>
                <TrashCanIcon className={styles['page__trash-can-icon']} />
                삭제
              </button>
              <button type="button" className={styles['page__save-button']}>
                <PenIcon className={styles['page__pen-icon']} />
                시간표 저장
              </button>
            </div>
            <ErrorBoundary fallbackClassName="loading">
              <React.Suspense fallback={<LoadingSpinner size="50" />}>
                <Timetable
                  lectures={myLectureDayValue}
                  similarSelectedLecture={similarSelectedLectureDayList}
                  selectedLectureIndex={selectedLectureIndex}
                  columnWidth={88.73}
                  firstColumnWidth={70}
                  rowHeight={32.5}
                  totalHeight={700}
                />
              </React.Suspense>
            </ErrorBoundary>
          </div>
        </div>
      </Suspense>
    </div>
  );
}
