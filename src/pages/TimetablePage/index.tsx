import React from 'react';
import useMediaQuery from 'utils/hooks/useMediaQuery';
import { MobilePage } from 'components/TimetablePage/MobilePage';
// import { ReactComponent as LoadingSpinner } from 'assets/svg/loading-spinner.svg';
import useScrollToTop from 'utils/hooks/useScrollToTop';
import LectureList from 'components/TimetablePage/DefaultPage/LectureList';
import MyLectureTimetable from 'components/TimetablePage/DefaultPage/MyLectureTimetable';
import MyLectureList from 'components/TimetablePage/DefaultPage/MyLectureList';
import Curriculum from 'components/TimetablePage/DefaultPage/Curriculum';
import styles from './TimetablePage.module.scss';

function TimetablePage() {
  const isMobile = useMediaQuery();
  useScrollToTop();

  return (
    <div className={styles.page}>
      {!isMobile ? (
        <>
          <h1 className={styles.page__title}>시간표</h1>
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
        </>
      ) : (
        <MobilePage />
      ) }
    </div>
  );
}

export default TimetablePage;
