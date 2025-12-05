import { useEffect } from 'react';
import Link from 'next/link';
import ErrorBoundary from 'components/boundary/ErrorBoundary';
import Timetable from 'components/TimetablePage/components/Timetable';
import useSemesterOptionList from 'components/TimetablePage/hooks/useSemesterOptionList';
import ROUTES from 'static/routes';
import useLogger from 'utils/hooks/analytics/useLogger';
import { useSemesterAction } from 'utils/zustand/semester';
import styles from './IndexTimetable.module.scss';

export default function IndexTimeTable({ initialTimetableFrameId }: { initialTimetableFrameId: number }) {
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
          <Timetable
            timetableFrameId={initialTimetableFrameId}
            columnWidth={44}
            firstColumnWidth={29}
            rowHeight={17.3}
            totalHeight={369}
          />
        </Link>
      </ErrorBoundary>
    </div>
  );
}
