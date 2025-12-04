import React from 'react';
import Link from 'next/link';
import ErrorBoundary from 'components/boundary/ErrorBoundary';
import Timetable from 'components/TimetablePage/components/Timetable';
import ROUTES from 'static/routes';
import useLogger from 'utils/hooks/analytics/useLogger';
import styles from './IndexTimetable.module.scss';

function CurrentSemesterTimetable({ initialTimetableFrameId }: { initialTimetableFrameId: number }) {
  return (
    <Timetable
      timetableFrameId={initialTimetableFrameId}
      columnWidth={44}
      firstColumnWidth={29}
      rowHeight={17.3}
      totalHeight={369}
    />
  );
}

export default function IndexTimeTable({ initialTimetableFrameId }: { initialTimetableFrameId: number }) {
  const logger = useLogger();

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
          <CurrentSemesterTimetable initialTimetableFrameId={initialTimetableFrameId} />
        </Link>
      </ErrorBoundary>
    </div>
  );
}
