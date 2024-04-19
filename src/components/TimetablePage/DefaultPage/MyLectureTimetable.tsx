/* eslint-disable no-restricted-imports */
import ErrorBoundary from 'components/common/ErrorBoundary';
import LoadingSpinner from 'components/common/LoadingSpinner';
import React from 'react';
import useImageDownload from 'utils/hooks/useImageDownload';
import { LectureInfo, TimetableDayLectureInfo } from 'interfaces/Lecture';
import { useRecoilValue } from 'recoil';
import { selectedSemesterAtom, selectedTempLectureSelector } from 'utils/recoil/semester';
import useTimetableDayList from 'utils/hooks/useTimetableDayList';
import styles from './DefaultPage.module.scss';
import SemesterListbox from '../MyLectureTimetable/SemesterListbox';
import Timetable from '../MyLectureTimetable/Timetable';
import useLectureList from '../hooks/useLectureList';

interface Props {
  myLectures: TimetableDayLectureInfo[][];
}

export default function MyLectureTimetable({ myLectures }: Props) {
  const { onImageDownload: onTimetableImageDownload, divRef: timetableRef } = useImageDownload();
  const selectedSemester = useRecoilValue(selectedSemesterAtom);
  const selectedLecture = useRecoilValue(selectedTempLectureSelector);
  const { data: lectureList } = useLectureList(selectedSemester);
  const similarSelectedLecture = (lectureList as unknown as Array<LectureInfo>)
    ?.filter((lecture) => lecture.code === selectedLecture?.code)
    ?? [];

  const selectedLectureIndex = similarSelectedLecture
    .findIndex(({ lecture_class }) => lecture_class === selectedLecture?.lecture_class);
  const similarSelectedLectureDayList = useTimetableDayList(similarSelectedLecture);

  return (
    <div className={styles['page__timetable-wrap']}>
      <div className={styles.page__filter}>
        <div className={styles.page__semester}>
          <SemesterListbox />
        </div>
        <button
          type="button"
          className={styles.page__button}
          onClick={() => onTimetableImageDownload('my-timetable')}
        >
          <img src="https://static.koreatech.in/assets/img/ic-image.png" alt="이미지" />
          이미지로 저장하기
        </button>
      </div>
      <div ref={timetableRef} className={styles.page__timetable}>
        <ErrorBoundary fallbackClassName="loading">
          <React.Suspense fallback={<LoadingSpinner size="50" />}>
            <Timetable
              lectures={myLectures}
              similarSelectedLecture={similarSelectedLectureDayList}
              selectedLectureIndex={selectedLectureIndex}
              columnWidth={55}
              firstColumnWidth={52}
              rowHeight={21}
              totalHeight={456}
            />
          </React.Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
}
