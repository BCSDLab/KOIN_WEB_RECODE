/* eslint-disable no-restricted-globals */
import LoadingSpinner from 'components/common/LoadingSpinner';
import TimetableHeader from 'pages/TimetablePage/components/TimetableHeader';
import React, { Suspense } from 'react';
import TimetableList from 'pages/TimetablePage/components/TimetableList';
import MainTimetable from 'pages/TimetablePage/components/MyLectureTimetable';
import useLogger from 'utils/hooks/analytics/useLogger';
import styles from './DefaultPage.module.scss';

interface DefaultPageProps {
  frameId: number,
  setCurrentFrameId: (index: number) => void,
}

export default function DefaultPage({ frameId, setCurrentFrameId }: DefaultPageProps) {
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
          <TimetableList currentFrameIndex={frameId} setCurrentFrameIndex={setCurrentFrameId} />
          <MainTimetable frameId={frameId} />
        </div>
      </Suspense>
    </div>
  );
}
