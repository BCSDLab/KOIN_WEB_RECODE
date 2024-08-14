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
  const handlePopState = React.useCallback(() => {
    history.back();
    // swipe로 뒤로가기 시
    if (sessionStorage.getItem('swipeToBack') === 'true') {
      logger.actionEventSwipe({
        actionTitle: 'USER',
        title: 'timetable_back',
        value: 'OS스와이프',
        previous_page: '시간표',
        current_page: '메인',
        duration_time: (new Date().getTime() - Number(sessionStorage.getItem('enterTimetablePage'))) / 1000,
      });
      return;
    }
    // 브라우저의 뒤로가기 버튼 클릭 시 / 마우스 사이드 버튼 누를 시
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
    if (history.state.state !== 'timetable') {
      history.pushState({ state: 'timetable' }, '');
    }
  }, []);

  React.useEffect(() => {
    window.addEventListener('popstate', handlePopState);
    return (() => {
      window.removeEventListener('popstate', handlePopState);
    });
  }, [handlePopState]);

  React.useEffect(() => {
    sessionStorage.setItem('swipeToBack', 'false');
    const handleWheel = (e: WheelEvent) => {
      // 한 번에 최소 100px만큼 스크롤(드래그) 시 swipe했다고 간주
      if (e.deltaX < -100) {
        sessionStorage.setItem('swipeToBack', 'true');
      }
    };
    window.addEventListener('wheel', handleWheel);
    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, []);

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
