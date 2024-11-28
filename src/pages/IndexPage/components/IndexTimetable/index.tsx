import React, { Suspense, useEffect } from 'react';
import Timetable from 'pages/TimetablePage/components/Timetable';
import { Link } from 'react-router-dom';
import LoadingSpinner from 'assets/svg/loading-spinner.svg';
import ErrorBoundary from 'components/common/ErrorBoundary';
import { useSemesterAction, useSemester } from 'utils/zustand/semester';
import useSemesterOptionList from 'pages/TimetablePage/hooks/useSemesterOptionList';
import useMyLectures from 'pages/TimetablePage/hooks/useMyLectures';
import useTimetableFrameList from 'pages/TimetablePage/hooks/useTimetableFrameList';
import useTimetableDayList from 'pages/TimetablePage/hooks/useTimetableDayList';
import useTokenState from 'utils/hooks/state/useTokenState';
import useLogger from 'utils/hooks/analytics/useLogger';
import ROUTES from 'static/routes';
import styles from './IndexTimetable.module.scss';

function CurrentSemesterTimetable() {
  const semester = useSemester();
  const token = useTokenState();
  const [currentFrameIndex, setCurrentFrameIndex] = React.useState<number>(0);
  const { data: timetableFrameList } = useTimetableFrameList(token, semester);

  useEffect(() => {
    if (timetableFrameList) {
      const mainFrame = timetableFrameList.find(
        (frame) => frame.is_main,
      );
      if (mainFrame && mainFrame.id) {
        setCurrentFrameIndex(mainFrame.id);
      }
    }
  }, [timetableFrameList]);

  const { myLectures } = useMyLectures(currentFrameIndex);
  const myLectureDayValue = useTimetableDayList(myLectures);

  return myLectureDayValue ? (
    <Timetable
      frameId={currentFrameIndex}
      lectures={myLectureDayValue}
      columnWidth={44}
      firstColumnWidth={29}
      rowHeight={17.3}
      totalHeight={369}
    />
  ) : (
    <div className={styles['template__loading-spinner']}>
      <LoadingSpinner />
    </div>
  );
}

export default function IndexTimeTable() {
  const { updateSemester } = useSemesterAction();
  const semesterOptionList = useSemesterOptionList();
  const logger = useLogger();

  useEffect(() => {
    if (semesterOptionList.length > 0) updateSemester(semesterOptionList[0].value);
  }, [semesterOptionList, updateSemester]);

  return (
    <div className={styles.template}>
      <Link
        to={ROUTES.Timetable()}
        className={styles.title}
        onClick={() => {
          logger.actionEventClick({
            actionTitle: 'USER',
            title: 'main_timetable',
            value: 'text',
          });
        }}
      >
        시간표
      </Link>
      <ErrorBoundary fallbackClassName="loading">
        <Suspense fallback={null}>
          <Link
            to={ROUTES.Timetable()}
            onClick={() => {
              logger.actionEventClick({
                actionTitle: 'USER',
                title: 'main_timetable',
                value: 'table',
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
