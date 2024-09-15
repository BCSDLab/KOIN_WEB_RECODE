import { cn } from '@bcsdlab/utils';
import ErrorBoundary from 'components/common/ErrorBoundary';
import LoadingSpinner from 'components/common/LoadingSpinner';
import Timetable from 'pages/TimetablePage/components/Timetable';
import React, { Suspense } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useTimetableDayListV2 from 'pages/TimetablePage/hooks/useTimetableDayListV2';
import { ReactComponent as PenIcon } from 'assets/svg/pen-icon.svg';
import LectureList from 'pages/TimetablePage/components/LectureList';
import CustomLecture from 'pages/TimetablePage/components/CustomLecture';
import TotalGrades from 'pages/TimetablePage/components/TotalGrades';
import useLectureList from 'pages/TimetablePage/hooks/useLectureList';
import { useSemester } from 'utils/zustand/semester';
import useMyLecturesV2 from 'pages/TimetablePage/hooks/useMyLecturesV2';
import { useTempLecture } from 'utils/zustand/myTempLecture';
import { ReactComponent as TimetableIcon } from 'assets/svg/timetable-icon.svg';
import styles from './DefaultPage.module.scss';

export default function DefaultPage({ frameId }: { frameId: string | undefined }) {
  const navigate = useNavigate();
  const semester = useSemester();
  const { pathname } = useLocation();
  const { myLecturesV2 } = useMyLecturesV2(Number(frameId));
  const myLectureDayValue = useTimetableDayListV2(myLecturesV2);
  const { data: lectureList } = useLectureList(semester);
  const tempLecture = useTempLecture();
  const similarSelectedLecture = lectureList
    ?.filter((lecture) => lecture.code === tempLecture?.code)
    ?? [];
  const selectedLectureIndex = similarSelectedLecture
    .findIndex(({ lecture_class }) => lecture_class === tempLecture?.lecture_class);
  const similarSelectedLectureDayList = useTimetableDayListV2(similarSelectedLecture);
  const handleCourseClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { value: courseType } = e.currentTarget;
    navigate(`/timetable/modify/${courseType}/${frameId}`);
  };

  return (
    <div className={styles.page}>
      <div className={styles.timetable}>
        <TimetableIcon className={styles.timetable__icon} />
        <h1 className={styles.timetable__title}>시간표</h1>
      </div>
      <Suspense
        fallback={(
          <div className={styles['central-loading-spinner']}>
            <LoadingSpinner size="100" />
          </div>
        )}
      >
        <div className={styles.page__content}>
          <div>
            <div className={styles['page__button-group']}>
              <button
                type="button"
                className={cn({
                  [styles['page__regular-course-button']]: true,
                  [styles['page__regular-course-button--active']]:
                    pathname.includes('/regular'),
                  [styles['page__regular-course-button--inactive']]:
                    pathname.includes('/direct'),
                })}
                value="regular"
                onClick={handleCourseClick}
                disabled={pathname.includes('/regular')}
              >
                정규 과목
              </button>
              <button
                type="button"
                className={cn({
                  [styles['page__directly-add-button']]: true,
                  [styles['page__directly-add-button--active']]:
                    pathname.includes('/direct'),
                  [styles['page__directly-add-button--inactive']]:
                    pathname.includes('/regular'),
                })}
                value="direct"
                onClick={handleCourseClick}
                disabled={pathname.includes('/direct')}
              >
                직접 추가
              </button>
            </div>
            {/* TODO: 직접 추가 UI, 강의 리스트 UI 추가 */}
            {pathname.includes('/regular') ? (
              <LectureList frameId={Number(frameId)} />
            ) : (
              <CustomLecture frameId={frameId} />
            )}
          </div>
          <div className={styles.page__timetable}>
            <div className={styles['page__timetable-button-group']}>
              <div className={styles['page__total-grades']}>
                <TotalGrades myLectureList={myLecturesV2} />
              </div>
              <button
                type="button"
                className={styles['page__save-button']}
                onClick={() => navigate('/timetable')}
              >
                <PenIcon className={styles['page__pen-icon']} />
                시간표 저장
              </button>
            </div>
            <ErrorBoundary fallbackClassName="loading">
              <React.Suspense fallback={<LoadingSpinner size="50" />}>
                <Timetable
                  frameId={Number(frameId)}
                  lectures={myLectureDayValue}
                  similarSelectedLecture={similarSelectedLectureDayList}
                  selectedLectureIndex={selectedLectureIndex}
                  columnWidth={88.73}
                  firstColumnWidth={44.36}
                  rowHeight={33.07}
                  totalHeight={699}
                />
              </React.Suspense>
            </ErrorBoundary>
          </div>
        </div>
      </Suspense>
    </div>
  );
}
