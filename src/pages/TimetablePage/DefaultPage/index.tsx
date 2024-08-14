/* eslint-disable no-restricted-globals */
/* eslint-disable no-restricted-imports */
import LoadingSpinner from 'components/common/LoadingSpinner';
import React, { Suspense } from 'react';
import useLogger from 'utils/hooks/analytics/useLogger';
import Curriculum from '../components/Curriculum';
import LectureList from '../components/LectureList';
import MyLectureList from '../components/MyLectureList';
import MyLectureTimetable from '../components/MyLectureTimetable';
import styles from './DefaultPage.module.scss';

export default function DefaultPage() {
  const logger = useLogger();
  const isClickedFirst = React.useRef(false);
  const handlePopState = React.useCallback(() => {
    history.back();
    sessionStorage.removeItem('timetableVisited');
    logger.actionEventClick({
      actionTitle: 'USER',
      title: 'timetable_back',
      value: '뒤로가기버튼',
      previous_page: '시간표',
      current_page: '메인',
      duration_time: (new Date().getTime() - Number(sessionStorage.getItem('enterTimetablePage'))) / 1000,
    });
  }, [logger]);

  React.useEffect(() => {
    const hasVisited = sessionStorage.getItem('timetableVisited');
    if (!hasVisited) {
      history.pushState({ state: 'timetable' }, '');
      sessionStorage.setItem('timetableVisited', 'true');
      isClickedFirst.current = true;
    }
  }, []);

  React.useEffect(() => {
    window.addEventListener('popstate', handlePopState);
    return (() => {
      window.removeEventListener('popstate', handlePopState);
    });
  }, [handlePopState]);

  return (
    <>
      <h1 className={styles.page__title}>시간표</h1>
      <Suspense fallback={<div className={styles['central-loading-spinner']}><LoadingSpinner size="100" /></div>}>
        <div className={styles.page__content}>
          {/* 강의 목록 */}
          <LectureList />
          {/* 나의 시간표 타임 테이블 */}
          <MyLectureTimetable />
          {/* 나의 시간표 강의 목록 */}
          <MyLectureList />
          {/* 시간표 커리큘럼 */}
          <Curriculum />
        </div>
      </Suspense>
    </>
  );
}
