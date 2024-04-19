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
import { myLecturesAtom, selectedSemesterAtom, selectedTempLectureSelector } from 'utils/recoil/semester';
import useTokenState from 'utils/hooks/useTokenState';
import useTimetableInfoList from 'components/TimetablePage/hooks/useTimetableInfoList';
import useTimetableDayList from 'utils/hooks/useTimetableDayList';
import useLectureList from 'components/TimetablePage/hooks/useLectureList';
import { LectureInfo } from 'interfaces/Lecture';
import styles from './TimetablePage.module.scss';

function TimetablePage() {
  const isMobile = useMediaQuery();
  useScrollToTop();

  const myLecturesFromLocalStorageValue = useRecoilValue(myLecturesAtom);

  const token = useTokenState();
  const selectedSemester = useRecoilValue(selectedSemesterAtom);
  const { data: myLecturesFromServer } = useTimetableInfoList(selectedSemester, token);
  const myLectureDayValue = useTimetableDayList(
    token
      ? (myLecturesFromServer ?? [])
      : (myLecturesFromLocalStorageValue ?? []),
  );

  const selectedLecture = useRecoilValue(selectedTempLectureSelector);
  const { data: lectureList } = useLectureList(selectedSemester);
  const similarSelectedLecture = (lectureList as unknown as Array<LectureInfo>)
    ?.filter((lecture) => lecture.code === selectedLecture?.code)
    ?? [];
  const similarSelectedLectureDayList = useTimetableDayList(similarSelectedLecture);
  const selectedLectureIndex = similarSelectedLecture
    .findIndex(({ lecture_class }) => lecture_class === selectedLecture?.lecture_class);

  return (
    <div className={styles.page}>
      {!isMobile ? (
        <>
          <h1 className={styles.page__title}>시간표</h1>
          <div className={styles.page__content}>
            {/* 강의 목록 */}
            <LectureList />
            {/* 나의 시간표 타임 테이블 */}
            <MyLectureTimetable
              lectures={myLectureDayValue}
              similarSelectedLecture={similarSelectedLectureDayList}
              selectedLectureIndex={selectedLectureIndex}
            />
            {/* 나의 시간표 강의 목록 */}
            <MyLectureList />
            {/* 시간표 커리큘럼 */}
            <Curriculum />
          </div>
        </>
      ) : (
        <MobilePage
          lectures={myLectureDayValue}
          similarSelectedLecture={similarSelectedLectureDayList}
          selectedLectureIndex={selectedLectureIndex}
        />
      ) }
    </div>
  );
}

export default TimetablePage;
