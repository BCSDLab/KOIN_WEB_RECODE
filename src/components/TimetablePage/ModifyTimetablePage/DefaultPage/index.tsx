import React, { Suspense } from 'react';
import { useRouter } from 'next/router';
import { cn } from '@bcsdlab/utils';
import PenIcon from 'assets/svg/pen-icon.svg';
import TimetableIcon from 'assets/svg/timetable-icon.svg';
import ErrorBoundary from 'components/boundary/ErrorBoundary';
import LoadingSpinner from 'components/feedback/LoadingSpinner';
import CustomLecture from 'components/TimetablePage/components/CustomLecture';
import LectureList from 'components/TimetablePage/components/LectureList';
import Timetable from 'components/TimetablePage/components/Timetable';
import TotalGrades from 'components/TimetablePage/components/TotalGrades';
import useLectureList from 'components/TimetablePage/hooks/useLectureList';
import useMyLectures from 'components/TimetablePage/hooks/useMyLectures';
import { useTempLecture } from 'utils/zustand/myTempLecture';
import { useSemester } from 'utils/zustand/semester';
import styles from './DefaultPage.module.scss';

export default function DefaultPage({ timetableFrameId }: { timetableFrameId: number }) {
  const router = useRouter();
  const navigate = router.push;
  const semester = useSemester();
  const { pathname } = router;
  const { myLectures } = useMyLectures(Number(timetableFrameId));
  const { data: lectureList } = useLectureList(semester);
  const tempLecture = useTempLecture();
  const similarSelectedLecture = lectureList?.filter((lecture) => lecture.code === tempLecture?.code) ?? [];
  const selectedLectureIndex = similarSelectedLecture.findIndex(
    ({ lecture_class }) => lecture_class === tempLecture?.lecture_class,
  );
  const handleCourseClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { value: courseType } = e.currentTarget;
    navigate(`/timetable/modify/${courseType}/${timetableFrameId}`);
  };

  return (
    <div className={styles.page}>
      <div className={styles.timetable}>
        <div className={styles.timetable__icon}>
          <TimetableIcon />
        </div>
        <h1 className={styles.timetable__title}>시간표</h1>
      </div>
      <Suspense
        fallback={
          <div className={styles['central-loading-spinner']}>
            <LoadingSpinner size="100" />
          </div>
        }
      >
        <div className={styles.page__content}>
          <div>
            <div className={styles['page__button-group']}>
              <button
                type="button"
                className={cn({
                  [styles['page__regular-course-button']]: true,
                  [styles['page__regular-course-button--active']]: pathname.includes('/regular'),
                  [styles['page__regular-course-button--inactive']]: pathname.includes('/direct'),
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
                  [styles['page__directly-add-button--active']]: pathname.includes('/direct'),
                  [styles['page__directly-add-button--inactive']]: pathname.includes('/regular'),
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
              <LectureList timetableFrameId={timetableFrameId} />
            ) : (
              <CustomLecture timetableFrameId={timetableFrameId} />
            )}
          </div>
          <div className={styles.page__timetable}>
            <div className={styles['page__timetable-button-group']}>
              <div className={styles['page__total-grades']}>
                <TotalGrades myLectureList={myLectures} />
              </div>
              <button
                type="button"
                className={styles['page__save-button']}
                onClick={() => navigate(`/timetable?timetableFrameId=${timetableFrameId}`)}
              >
                <div className={styles['page__pen-icon']}>
                  <PenIcon />
                </div>
                수정 완료
              </button>
            </div>
            <ErrorBoundary fallbackClassName="loading">
              <React.Suspense fallback={<LoadingSpinner size="50" />}>
                <Timetable
                  timetableFrameId={timetableFrameId}
                  similarSelectedLecture={similarSelectedLecture}
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
