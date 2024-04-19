import React from 'react';
import useMediaQuery from 'utils/hooks/useMediaQuery';
import { MobilePage } from 'components/TimetablePage/MobilePage';
// import { ReactComponent as LoadingSpinner } from 'assets/svg/loading-spinner.svg';
import useScrollToTop from 'utils/hooks/useScrollToTop';
import LectureList from 'components/TimetablePage/DefaultPage/LectureList';
import MyLectureTimetable from 'components/TimetablePage/DefaultPage/MyLectureTimetable';
import MyLectureList from 'components/TimetablePage/DefaultPage/MyLectureList';
import Curriculum from 'components/TimetablePage/DefaultPage/Curriculum';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
  myLectureAddLectureSelector, myLectureRemoveLectureSelector, myLecturesAtom, selectedSemesterAtom,
} from 'utils/recoil/semester';
import useTokenState from 'utils/hooks/useTokenState';
import useTimetableInfoList from 'components/TimetablePage/hooks/useTimetableInfoList';
import useAddTimetableLecture from 'components/TimetablePage/hooks/useAddTimetableLecture';
import { LectureInfo, TimetableLectureInfo } from 'interfaces/Lecture';
import useDeleteTimetableLecture from 'components/TimetablePage/hooks/useDeleteTimetableLecture';
import styles from './TimetablePage.module.scss';

function TimetablePage() {
  const isMobile = useMediaQuery();
  useScrollToTop();

  const token = useTokenState();
  const selectedSemester = useRecoilValue(selectedSemesterAtom);
  const myLecturesFromLocalStorageValue = useRecoilValue(myLecturesAtom);
  const { data: myLecturesFromServer } = useTimetableInfoList(selectedSemester, token);

  const myLectures = token ? (myLecturesFromServer ?? []) : (myLecturesFromLocalStorageValue ?? []);

  const { mutate: mutateAddWithServer } = useAddTimetableLecture(token);
  const addLectureToLocalStorage = useSetRecoilState(myLectureAddLectureSelector);

  const addMyLecture = (clickedLecture: LectureInfo) => {
    if (token) {
      mutateAddWithServer({
        semester: selectedSemester,
        timetable: [{ class_title: clickedLecture.name, ...clickedLecture }],
      });
    } else {
      addLectureToLocalStorage(clickedLecture);
    }
  };

  const { mutate: removeLectureFromServer } = useDeleteTimetableLecture(selectedSemester, token);
  const removeLectureFromLocalStorage = useSetRecoilState(myLectureRemoveLectureSelector);

  const removeMyLecture = (clickedLecture: LectureInfo | TimetableLectureInfo) => {
    if ('name' in clickedLecture) {
      removeLectureFromLocalStorage(clickedLecture);
      return;
    }
    removeLectureFromServer(clickedLecture.id.toString());
  };

  return (
    <div className={styles.page}>
      {!isMobile ? (
        <>
          <h1 className={styles.page__title}>시간표</h1>
          <div className={styles.page__content}>
            {/* 강의 목록 */}
            <LectureList myLectures={myLectures} addMyLecture={addMyLecture} />
            {/* 나의 시간표 타임 테이블 */}
            <MyLectureTimetable myLectures={myLectures} />
            {/* 나의 시간표 강의 목록 */}
            <MyLectureList myLectures={myLectures} removeMyLectures={removeMyLecture} />
            {/* 시간표 커리큘럼 */}
            <Curriculum />
          </div>
        </>
      ) : (
        <MobilePage myLectures={myLectures} />
      ) }
    </div>
  );
}

export default TimetablePage;
