/* eslint-disable no-restricted-globals */
import React, { Suspense } from 'react';
import LoadingSpinner from 'components/feedback/LoadingSpinner';
import TimetableList from 'pages/TimetablePage/components/TimetableList';
import MainTimetable from 'pages/TimetablePage/components/MainTimetable';
import useLogger from 'utils/hooks/analytics/useLogger';
import TimetableIcon from 'assets/svg/timetable-icon.svg';
import styles from './DefaultPage.module.scss';

interface DefaultPageProps {
  timetableFrameId: number,
  setCurrentFrameId: (index: number) => void,
}

export default function DefaultPage({ timetableFrameId, setCurrentFrameId }: DefaultPageProps) {
  const logger = useLogger();
  const handlePopState = React.useCallback(() => {
    history.back();
    // swipe로 뒤로가기 시
    if (sessionStorage.getItem('swipeToBack') === 'true') {
      logger.actionEventSwipe({
        actionTitle: 'USER',
        event_label: 'timetable_back',
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
      event_label: 'timetable_back',
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      <div className={styles['timetable-header']}>
        <TimetableIcon />
        <h1 className={styles['timetable-header__title']}>시간표</h1>
      </div>
      <Suspense
        fallback={(
          <div className={styles['central-loading-spinner']}>
            <LoadingSpinner size="100" />
          </div>
        )}
      >
        <div className={styles.page__content}>
          <TimetableList
            currentFrameIndex={timetableFrameId}
            setCurrentFrameIndex={setCurrentFrameId}
          />
          <MainTimetable timetableFrameId={timetableFrameId} />
        </div>
      </Suspense>
    </div>
  );
}
