import React, { Suspense, useEffect } from 'react';
import Timetable from 'components/TimetablePage/components/Timetable';
import ErrorBoundary from 'components/boundary/ErrorBoundary';
import { useSemesterAction, useSemester } from 'utils/zustand/semester';
import useSemesterOptionList from 'components/TimetablePage/hooks/useSemesterOptionList';
import useTimetableFrameList from 'components/TimetablePage/hooks/useTimetableFrameList';
import useTokenState from 'utils/hooks/state/useTokenState';
import useLogger from 'utils/hooks/analytics/useLogger';
import ROUTES from 'static/routes';
import Link from 'next/link';
import styles from './IndexTimetable.module.scss';

function CurrentSemesterTimetable() {
  const semester = useSemester();
  const token = useTokenState();
  const [currentFrameIndex, setCurrentFrameIndex] = React.useState<number>(0);
  const { data: timetableFrameList } = useTimetableFrameList(token, semester);

  useEffect(() => {
    if (timetableFrameList) {
      const mainFrame = timetableFrameList.find((frame) => frame.is_main);
      if (mainFrame && mainFrame.id) {
        setCurrentFrameIndex(mainFrame.id);
      }
    }
  }, [timetableFrameList]);

  return (
    <Timetable
      timetableFrameId={currentFrameIndex}
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
        href={ROUTES.Timetable()}
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
            href={ROUTES.Timetable()}
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
