/* eslint-disable no-restricted-imports */
import ErrorBoundary from 'components/common/ErrorBoundary';
import LoadingSpinner from 'components/common/LoadingSpinner';
import React from 'react';
import useImageDownload from 'utils/hooks/useImageDownload';
import useTimetableDayList from 'utils/hooks/useTimetableDayList';
import { useSemester } from 'utils/zustand/semester';
import { useTempLecture } from 'utils/zustand/myTempLecture';
import { useNavigate } from 'react-router-dom';
import styles from '../../TimetablePage/DefaultPage/DefaultPage.module.scss';
import Timetable from '../../../../components/TimetablePage/Timetable';
import useLectureList from '../../hooks/useLectureList';
import useMyLectures from '../../hooks/useMyLectures';

export default function MainTimetable() {
  const { myLectures } = useMyLectures();
  const navigate = useNavigate();
  const { onImageDownload: onTimetableImageDownload, divRef: timetableRef } = useImageDownload();
  const semester = useSemester();
  const tempLecture = useTempLecture();
  const { data: lectureList } = useLectureList(semester);
  const similarSelectedLecture = lectureList
    ?.filter((lecture) => lecture.code === tempLecture?.code)
    ?? [];
  const selectedLectureIndex = similarSelectedLecture
    .findIndex(({ lecture_class }) => lecture_class === tempLecture?.lecture_class);

  const similarSelectedLectureDayList = useTimetableDayList(similarSelectedLecture);
  const myLectureDayValue = useTimetableDayList(myLectures);

  return (
    <div className={styles['page__timetable-wrap']}>
      <div className={styles.page__filter}>
        {/* TODO: CurriculumListBox 수정 필요 */}
        {/* <CurriculumListBox /> */}
        <button
          type="button"
          className={styles.page__button}
          onClick={() => onTimetableImageDownload('my-timetable')}
        >
          <img src="https://static.koreatech.in/assets/img/ic-image.png" alt="" />
          이미지로 저장하기
        </button>
        <button
          type="button"
          className={styles.page__button}
          onClick={() => navigate('/timetable/modify')}
        >
          <img src="https://static.koreatech.in/assets/img/ic-image.png" alt="" />
          시간표 수정
        </button>
      </div>
      <div ref={timetableRef} className={styles.page__timetable}>
        <ErrorBoundary fallbackClassName="loading">
          <React.Suspense fallback={<LoadingSpinner size="50" />}>
            <Timetable
              lectures={myLectureDayValue}
              similarSelectedLecture={similarSelectedLectureDayList}
              selectedLectureIndex={selectedLectureIndex}
              columnWidth={140}
              firstColumnWidth={70}
              rowHeight={32.5}
              totalHeight={700}
            />
          </React.Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
}
