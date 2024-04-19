import React from 'react';
import useMediaQuery from 'utils/hooks/useMediaQuery';
import { MobilePage } from 'components/TimetablePage/MobilePage';
// import { ReactComponent as LoadingSpinner } from 'assets/svg/loading-spinner.svg';
import useScrollToTop from 'utils/hooks/useScrollToTop';
import LectureList from 'components/TimetablePage/DefaultPage/LectureList';
import MyLectureTimetable from 'components/TimetablePage/DefaultPage/MyLectureTimetable';
import MyLectureList from 'components/TimetablePage/DefaultPage/MyLectureList';
import Curriculum from 'components/TimetablePage/DefaultPage/Curriculum';
import { useRecoilValue } from 'recoil';
import { myLecturesAtom, selectedSemesterAtom } from 'utils/recoil/semester';
import useTokenState from 'utils/hooks/useTokenState';
import useTimetableInfoList from 'components/TimetablePage/hooks/useTimetableInfoList';
import useTimetableDayList from 'utils/hooks/useTimetableDayList';
import styles from './TimetablePage.module.scss';

function TimetablePage() {
  const isMobile = useMediaQuery();
  useScrollToTop();

  const token = useTokenState();
  const selectedSemester = useRecoilValue(selectedSemesterAtom);
  const myLecturesFromLocalStorageValue = useRecoilValue(myLecturesAtom);
  const { data: myLecturesFromServer } = useTimetableInfoList(selectedSemester, token);

  const myLectures = token ? (myLecturesFromServer ?? []) : (myLecturesFromLocalStorageValue ?? []);
  const myLectureDayValue = useTimetableDayList(myLectures);

  return (
    <div className={styles.page}>
      {!isMobile ? (
        <>
          <h1 className={styles.page__title}>시간표</h1>
          <div className={styles.page__content}>
            {/* 강의 목록 */}
            <LectureList myLectures={myLectures} />
            {/* 나의 시간표 타임 테이블 */}
            <MyLectureTimetable myLectures={myLectureDayValue} />
            {/* 나의 시간표 강의 목록 */}
            <MyLectureList myLectures={myLectures} />
            {/* 시간표 커리큘럼 */}
            <Curriculum />
          </div>
        </>
      ) : (
        <MobilePage lectures={myLectureDayValue} />
      ) }
    </div>
  );
}

export default TimetablePage;
