import { Suspense } from 'react';
import useTimetableDayList from 'utils/hooks/useTimetableDayList';
import Timetable from 'components/TimetablePage/Timetable';
import { Link } from 'react-router-dom';
import { ReactComponent as LoadingSpinner } from 'assets/svg/loading-spinner.svg';
import useLogger from 'utils/hooks/useLogger';
import ErrorBoundary from 'components/common/ErrorBoundary';
import { useSemesterAction } from 'utils/zustand/semester';
import useMyLectures from 'pages/TimetablePage/hooks/useMyLectures';
import useSemesterOptionList from 'pages/TimetablePage/hooks/useSemesterOptionList';
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
  const semesterOptionList = useSemesterOptionList();
  const { updateSemester } = useSemesterAction();
  const logger = useLogger();
  updateSemester(semesterOptionList[0].value);

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
