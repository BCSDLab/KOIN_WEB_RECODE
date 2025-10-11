import React, { Suspense, useEffect } from 'react';
import Timetable from 'pages/TimetablePage/components/Timetable';
import { Link } from 'react-router-dom';
import ErrorBoundary from 'components/boundary/ErrorBoundary';
import { useSemesterAction, useSemester } from 'utils/zustand/semester';
import useSemesterOptionList from 'pages/TimetablePage/hooks/useSemesterOptionList';
import useTimetableFrameList from 'pages/TimetablePage/hooks/useTimetableFrameList';
import useTokenState from 'utils/hooks/state/useTokenState';
import useLogger from 'utils/hooks/analytics/useLogger';
import ROUTES from 'static/routes';
import styles from './IndexTimetable.module.scss';

function CurrentSemesterTimetable() {
  const semester = useSemester();
  const token = useTokenState();
  const { data: timetableFrameList } = useTimetableFrameList(token, semester);

  const currentFrameId = timetableFrameList?.find((frame) => frame.is_main)?.id || 0;

  return (
    <Timetable
      timetableFrameId={currentFrameId}
      columnWidth={44}
      firstColumnWidth={29}
      rowHeight={17.3}
      totalHeight={369}
    />
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
            team: 'USER',
            event_label: 'main_timetable',
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
                team: 'USER',
                event_label: 'main_timetable',
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
