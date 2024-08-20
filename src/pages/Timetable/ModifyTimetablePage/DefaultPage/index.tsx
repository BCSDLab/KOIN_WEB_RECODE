import { cn } from '@bcsdlab/utils';
import ErrorBoundary from 'components/common/ErrorBoundary';
import LoadingSpinner from 'components/common/LoadingSpinner';
import Timetable from 'components/TimetablePage/Timetable';
import TimetableHeader from 'pages/Timetable/components/TimetableHeader';
import React, { Suspense, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useTimetableDayListV2 from 'utils/hooks/useTimetableDayListV2';
import { ReactComponent as PenIcon } from 'assets/svg/pen-icon.svg';
import LectureList from 'pages/Timetable/components/LectureList';
import CustomLecture from 'pages/Timetable/components/CustomLecture';
import useTimetableV2InfoList from 'pages/Timetable/hooks/useTimetableV2InfoList';
import TotalGrades from 'pages/Timetable/components/TotalGrades';
import useTokenState from 'utils/hooks/useTokenState';
import { useTempLecture } from 'utils/zustand/myTempLectureV2';
import useLectureList from 'pages/Timetable/hooks/useLectureList';
import { useSemester } from 'utils/zustand/semester';
import useMyLecturesV2 from 'pages/Timetable/hooks/useMyLecturesV2';
import styles from './DefaultPage.module.scss';

export default function DefaultPage({ frameId }: { frameId: string | undefined }) {
  const navigate = useNavigate();
  const token = useTokenState();
  const semester = useSemester();
  const [selectedCourseType, setSelectedCourseType] = useState('regular');
  const isRegularCourseSelected = selectedCourseType === 'regular';
  const { myLecturesV2 } = useMyLecturesV2(Number(frameId));
  const myLectureDayValue = useTimetableDayListV2(myLecturesV2);
  const { data: myLectureList } = useTimetableV2InfoList(
    Number(frameId),
    token,
  );
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
    setSelectedCourseType(courseType);
    navigate(`/timetable/modify/${courseType}/${frameId}`);
  };

  return (
    <div className={styles.page}>
      <TimetableHeader />
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
                    isRegularCourseSelected,
                  [styles['page__regular-course-button--inactive']]:
                    !isRegularCourseSelected,
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
                  [styles['page__directly-add-button--active']]:
                    !isRegularCourseSelected,
                  [styles['page__directly-add-button--inactive']]:
                    isRegularCourseSelected,
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
              <LectureList frameId={Number(frameId)} />
            ) : (
              <CustomLecture frameId={frameId} />
            )}
          </div>
          <div className={styles.page__timetable}>
            <div className={styles['page__timetable-button-group']}>
              <div className={styles['page__total-grades']}>
                <TotalGrades myLectureList={myLectureList} />
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
