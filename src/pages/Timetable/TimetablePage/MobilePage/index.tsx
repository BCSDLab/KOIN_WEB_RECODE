import React from 'react';
import ErrorBoundary from 'components/common/ErrorBoundary';
import { ReactComponent as LoadingSpinner } from 'assets/svg/loading-spinner.svg';
import showToast from 'utils/ts/showToast';
import useImageDownload from 'utils/hooks/ui/useImageDownload';
import useLogger from 'utils/hooks/analytics/useLogger';
import useTimetableDayList from 'utils/hooks/data/useTimetableDayList';
import { useSemester } from 'utils/zustand/semester';
import { useTempLecture } from 'utils/zustand/myTempLecture';
import Timetable from 'components/TimetablePage/Timetable';
import useLectureList from 'pages/Timetable/hooks/useLectureList';
import useMyLectures from 'pages/Timetable/hooks/useMyLectures';
import SemesterListbox from 'pages/Timetable/components/SemesterListbox';
import styles from './MobilePage.module.scss';

function MobilePage() {
  const logger = useLogger();
  const { myLectures } = useMyLectures();
  const { onImageDownload: onTimetableImageDownload, divRef: timetableRef } = useImageDownload();
  const handleImageDownloadClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    logger.click({
      title: 'timetable_imageDownload_click',
      value: '시간표 저장',
    });
    onTimetableImageDownload('my-timetable');
  };
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
    <>
      <div className={styles['page__timetable-wrap']}>
        <div className={styles.page__filter}>
          <div className={styles.page__semester}>
            <React.Suspense fallback={<LoadingSpinner className={styles['dropdown-loading-spinner']} />}>
              <SemesterListbox />
            </React.Suspense>
          </div>
          <button
            type="button"
            className={styles.page__button}
            onClick={(e) => handleImageDownloadClick(e)}
          >
            <img src="https://static.koreatech.in/assets/img/ic-image.png" alt="이미지" />
            이미지로 저장하기
          </button>
        </div>
        <div ref={timetableRef} className={styles.page__timetable}>
          <ErrorBoundary fallbackClassName="loading">
            <React.Suspense fallback={<LoadingSpinner className={styles['top-loading-spinner']} />}>
              <Timetable
                lectures={myLectureDayValue}
                similarSelectedLecture={similarSelectedLectureDayList}
                selectedLectureIndex={selectedLectureIndex}
                columnWidth={55}
                firstColumnWidth={52}
                rowHeight={21}
                totalHeight={439}
              />
            </React.Suspense>
          </ErrorBoundary>
        </div>
      </div>
      <button
        type="button"
        onClick={() => {
          showToast('info', 'PC환경만 지원합니다. PC를 이용해주세요.');
        }}
        className={styles['edit-timetable']}
      >
        시간표 편집하기
      </button>
    </>
  );
}

export { MobilePage };
