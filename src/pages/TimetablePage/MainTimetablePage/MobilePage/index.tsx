/* eslint-disable no-restricted-imports */
import React from 'react';
import ErrorBoundary from 'components/common/ErrorBoundary';
import { ReactComponent as LoadingSpinner } from 'assets/svg/loading-spinner.svg';
import showToast from 'utils/ts/showToast';
<<<<<<<< HEAD:src/pages/TimetablePage/MainTimetablePage/MobilePage/index.tsx
import useImageDownload from 'utils/hooks/useImageDownload';
import useLogger from 'utils/hooks/useLogger';
import Timetable from 'components/TimetablePage/Timetable';
import SemesterListbox from 'pages/TimetablePage/components/SemesterList';
import useMyLecturesV2 from 'pages/TimetablePage/hooks/useMyLecturesV2';
import useTimetableDayListV2 from 'utils/hooks/useTimetableDayListV2';
========
import useImageDownload from 'utils/hooks/ui/useImageDownload';
import useLogger from 'utils/hooks/analytics/useLogger';
import useTimetableDayList from 'utils/hooks/data/useTimetableDayList';
import { useSemester } from 'utils/zustand/semester';
import { useTempLecture } from 'utils/zustand/myTempLecture';
>>>>>>>> develop:src/pages/TimetablePage/MobilePage/index.tsx
import styles from './MobilePage.module.scss';
import SemesterListbox from '../components/MyLectureTimetable/SemesterListbox';
import Timetable from '../../../components/TimetablePage/Timetable';
import useLectureList from '../hooks/useLectureList';
import useMyLectures from '../hooks/useMyLectures';

function MobilePage({ frameId }: { frameId: string | undefined }) {
  const logger = useLogger();
  const { myLecturesV2 } = useMyLecturesV2(Number(frameId));
  const { onImageDownload: onTimetableImageDownload, divRef: timetableRef } = useImageDownload();
  const handleImageDownloadClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    logger.actionEventClick({
      actionTitle: 'USER',
      title: 'timetable',
      value: '이미지저장',
      duration_time: (new Date().getTime() - Number(sessionStorage.getItem('enterTimetablePage'))) / 1000,
    });
    onTimetableImageDownload('my-timetable');
  };
<<<<<<<< HEAD:src/pages/TimetablePage/MainTimetablePage/MobilePage/index.tsx

  const myLectureDayValueV2 = useTimetableDayListV2(myLecturesV2);
========
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
>>>>>>>> develop:src/pages/TimetablePage/MobilePage/index.tsx

  return (
    <>
      <div className={styles['page__timetable-wrap']}>
        <div className={styles.page__filter}>
          <div className={styles.page__semester}>
            <React.Suspense
              fallback={(
                <LoadingSpinner
                  className={styles['dropdown-loading-spinner']}
                />
              )}
            >
              <SemesterListbox />
            </React.Suspense>
          </div>
          <button
            type="button"
            className={styles.page__button}
            onClick={(e) => handleImageDownloadClick(e)}
          >
            <img
              src="https://static.koreatech.in/assets/img/ic-image.png"
              alt="이미지"
            />
            이미지로 저장하기
          </button>
        </div>
        <div ref={timetableRef} className={styles.page__timetable}>
          <ErrorBoundary fallbackClassName="loading">
            <React.Suspense
              fallback={
                <LoadingSpinner className={styles['top-loading-spinner']} />
              }
            >
              <Timetable
<<<<<<<< HEAD:src/pages/TimetablePage/MainTimetablePage/MobilePage/index.tsx
                frameId={Number(frameId)}
                lectures={myLectureDayValueV2}
========
                lectures={myLectureDayValue}
                similarSelectedLecture={similarSelectedLectureDayList}
                selectedLectureIndex={selectedLectureIndex}
>>>>>>>> develop:src/pages/TimetablePage/MobilePage/index.tsx
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
