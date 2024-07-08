import ErrorBoundary from 'components/common/ErrorBoundary';
import LoadingSpinner from 'components/common/LoadingSpinner';
import React from 'react';
import useImageDownload from 'utils/hooks/useImageDownload';
import useTimetableDayList from 'utils/hooks/useTimetableDayList';
import { useNavigate } from 'react-router-dom';
import useDeptList from 'pages/Auth/SignupPage/hooks/useDeptList';
import CurriculumListBox from 'pages/Timetable/components/Curriculum';
import { ReactComponent as DownloadIcon } from 'assets/svg/download-icon.svg';
import { ReactComponent as EditIcon } from 'assets/svg/pen-icon.svg';
import Timetable from 'components/TimetablePage/Timetable';
import useMyLectures from 'pages/Timetable/hooks/useMyLectures';
import TotalGrades from 'pages/Timetable/components/TotalGrades';
import { useSemester } from 'utils/zustand/semester';
import styles from './MyLectureTimetable.module.scss';

export default function MainTimetable() {
  const { myLectures } = useMyLectures();
  const navigate = useNavigate();
  const { onImageDownload: onTimetableImageDownload, divRef: timetableRef } = useImageDownload();
  const myLectureDayValue = useTimetableDayList(myLectures);
  const { data: deptList } = useDeptList();
  const semester = useSemester();
  return (
    <div className={styles['page__timetable-wrap']}>
      <div className={styles.page__filter}>
        <div className={styles['page__total-grades']}>
          <TotalGrades myLectureList={myLectures} />
        </div>
        <CurriculumListBox
          list={deptList}
        />
        <button
          type="button"
          className={styles.page__button}
          onClick={() => onTimetableImageDownload('my-timetable')}
        >
          <DownloadIcon />
          이미지 저장
        </button>
        <button
          type="button"
          className={styles.page__button}
          onClick={() => navigate(`/timetable/modify/regular/${semester}`)}
        >
          <EditIcon />
          시간표 수정
        </button>
      </div>
      <div ref={timetableRef} className={styles.page__timetable}>
        <ErrorBoundary fallbackClassName="loading">
          <React.Suspense fallback={<LoadingSpinner size="50" />}>
            <Timetable
              lectures={myLectureDayValue}
              columnWidth={140}
              firstColumnWidth={70}
              rowHeight={33}
              totalHeight={700}
            />
          </React.Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
}
