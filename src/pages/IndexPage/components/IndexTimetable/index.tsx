import { Suspense, useEffect } from 'react';
import useTimetableDayList from 'utils/hooks/data/useTimetableDayList';
import Timetable from 'components/TimetablePage/Timetable';
import { Link } from 'react-router-dom';
import { ReactComponent as LoadingSpinner } from 'assets/svg/loading-spinner.svg';
import useLogger from 'utils/hooks/analytics/useLogger';
import ErrorBoundary from 'components/common/ErrorBoundary';
import useMyLectures from 'pages/Timetable/hooks/useMyLectures';
import { useSemesterAction } from 'utils/zustand/semester';
import useSemesterOptionList from 'pages/Timetable/hooks/useSemesterOptionList';
import styles from './IndexTimetable.module.scss';

function CurrentSemesterTimetable(): JSX.Element {
  const { myLectures } = useMyLectures();
  const myLectureDayValue = useTimetableDayList(myLectures);
  return myLectureDayValue ? (
    <Timetable
      lectures={myLectureDayValue}
      columnWidth={40}
      firstColumnWidth={42}
      rowHeight={16}
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
