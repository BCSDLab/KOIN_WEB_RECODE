import { Suspense, useEffect } from 'react';
import useTimetableDayList from 'utils/hooks/useTimetableDayList';
import Timetable from 'components/TimetablePage/Timetable';
import { Link } from 'react-router-dom';
import { ReactComponent as LoadingSpinner } from 'assets/svg/loading-spinner.svg';
import useLogger from 'utils/hooks/useLogger';
import ErrorBoundary from 'components/common/ErrorBoundary';
import useMyLectures from 'pages/Timetable/hooks/useMyLectures';
import { useSemester, useSemesterAction } from 'utils/zustand/semester';
import useSemesterOptionList from 'pages/Timetable/hooks/useSemesterOptionList';
import useLectureList from 'pages/Timetable/hooks/useLectureList';
import { useTempLecture } from 'utils/zustand/myTempLecture';
import styles from './IndexTimetable.module.scss';

function CurrentSemesterTimetable(): JSX.Element {
  const { myLectures } = useMyLectures();
  const myLectureDayValue = useTimetableDayList(myLectures);
  const semester = useSemester();
  const tempLecture = useTempLecture();
  const { data: lectureList } = useLectureList(semester);
  const similarSelectedLecture = lectureList
    ?.filter((lecture) => lecture.code === tempLecture?.code)
    ?? [];
  const selectedLectureIndex = similarSelectedLecture
    .findIndex(({ lecture_class }) => lecture_class === tempLecture?.lecture_class);

  const similarSelectedLectureDayList = useTimetableDayList(similarSelectedLecture);
  return myLectureDayValue ? (
    <Timetable
      lectures={myLectureDayValue}
      similarSelectedLecture={similarSelectedLectureDayList}
      selectedLectureIndex={selectedLectureIndex}
      columnWidth={44}
      firstColumnWidth={29}
      rowHeight={17.3}
      totalHeight={369}
    />
  ) : (
    <LoadingSpinner className={styles['template__loading-spinner']} />
  );
}

export default function IndexTimeTable() {
  const { updateSemester } = useSemesterAction();
  const semesterOptionList = useSemesterOptionList();
  const logger = useLogger();

  useEffect(() => {
    updateSemester(semesterOptionList[0]?.value);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.template}>
      <Link
        to="/timetable"
        className={styles.title}
        onClick={() => {
          logger.actionEventClick({
            actionTitle: 'USER',
            title: 'entry_text_timetable',
            value: '시간표 텍스트 진입',
          });
        }}
      >
        시간표
      </Link>
      <ErrorBoundary fallbackClassName="loading">
        <Suspense fallback={null}>
          <Link
            to="/timetable"
            onClick={() => {
              logger.actionEventClick({
                actionTitle: 'USER',
                title: 'entry_table_timetable',
                value: '시간표 테이블 진입',
              });
            }}
          >
            <CurrentSemesterTimetable />
          </Link>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
