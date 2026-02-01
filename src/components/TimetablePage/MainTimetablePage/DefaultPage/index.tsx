import React from 'react';
import { useRouter } from 'next/router';
import GraduationIcon from 'assets/svg/graduation-icon.svg';
import TimetableIcon from 'assets/svg/timetable-icon.svg';
import Suspense from 'components/ssr/SSRSuspense';
import MainTimetable from 'components/TimetablePage/components/MainTimetable';
import TimetableList from 'components/TimetablePage/components/TimetableList';
import ROUTES from 'static/routes';
import useLogger from 'utils/hooks/analytics/useLogger';
import styles from './DefaultPage.module.scss';

interface DefaultPageProps {
  timetableFrameId: number;
  setCurrentFrameId: (index: number) => void;
}

export default function DefaultPage({ timetableFrameId, setCurrentFrameId }: DefaultPageProps) {
  const router = useRouter();
  const logger = useLogger();
  const handlePopState = React.useCallback(() => {
    // swipe로 뒤로가기 시
    if (sessionStorage.getItem('swipeToBack') === 'true') {
      logger.actionEventSwipe({
        team: 'USER',
        event_label: 'timetable_back',
        value: 'OS스와이프',
        previous_page: '시간표',
        current_page: '메인',
        duration_time: (new Date().getTime() - Number(sessionStorage.getItem('enterTimetablePage'))) / 1000,
      });
      history.back();
      return;
    }
    // 브라우저의 뒤로가기 버튼 클릭 시 / 마우스 사이드 버튼 누를 시
    logger.actionEventClick({
      team: 'USER',
      event_label: 'timetable_back',
      value: '뒤로가기버튼',
      previous_page: '시간표',
      current_page: '메인',
      duration_time: (new Date().getTime() - Number(sessionStorage.getItem('enterTimetablePage'))) / 1000,
    });
  }, [logger]);

  React.useEffect(() => {
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
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
        <div className={styles['timetable-header__left']}>
          <TimetableIcon />
          <h1 className={styles['timetable-header__title']}>시간표</h1>
        </div>
        <button
          type="button"
          className={styles['timetable-header__button']}
          onClick={() => {
            router.push(ROUTES.Course());
            logger.actionEventClick({
              team: 'USER',
              event_label: 'application_training',
              value: '',
            });
          }}
        >
          <GraduationIcon />
          모의 수강신청
        </button>
      </div>
      <Suspense>
        <div className={styles.page__content}>
          <TimetableList currentFrameIndex={timetableFrameId} setCurrentFrameIndex={setCurrentFrameId} />
          <MainTimetable timetableFrameId={timetableFrameId} />
        </div>
      </Suspense>
    </div>
  );
}
