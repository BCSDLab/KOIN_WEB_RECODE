import { useEffect } from 'react';
import Link from 'next/link';
import { isValidTimetableFrameId } from 'api/timetable/queries';
import ErrorBoundary from 'components/boundary/ErrorBoundary';
import Timetable from 'components/TimetablePage/components/Timetable';
import useSemesterOptionList from 'components/TimetablePage/hooks/useSemesterOptionList';
import useTimetableFrameList from 'components/TimetablePage/hooks/useTimetableFrameList';
import ROUTES from 'static/routes';
import useLogger from 'utils/hooks/analytics/useLogger';
import useMount from 'utils/hooks/state/useMount';
import useTokenState from 'utils/hooks/state/useTokenState';
import { useSemester, useSemesterAction } from 'utils/zustand/semester';
import styles from './IndexTimetable.module.scss';

export default function IndexTimeTable() {
  const { updateSemester } = useSemesterAction();
  const semesterOptionList = useSemesterOptionList();
  const logger = useLogger();
  const semester = useSemester();
  const token = useTokenState();
  const { data: timetableFrameList } = useTimetableFrameList(token, semester);

  const currentFrameId = timetableFrameList?.find((frame) => frame.is_main)?.id;
  const hasValidCurrentFrameId = isValidTimetableFrameId(currentFrameId);
  const isClient = useMount();

  useEffect(() => {
    if (semesterOptionList.length > 0) updateSemester(semesterOptionList[0].value);
  }, [semesterOptionList, updateSemester]);

  const renderPlaceholder = (
    <Timetable
      timetableFrameId={0}
      columnWidth={44}
      firstColumnWidth={29}
      rowHeight={17.3}
      totalHeight={369}
    />
  );

  const renderTimetable = hasValidCurrentFrameId ? (
    <Timetable
      timetableFrameId={currentFrameId}
      columnWidth={44}
      firstColumnWidth={29}
      rowHeight={17.3}
      totalHeight={369}
    />
  ) : (
    renderPlaceholder
  );

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
          {isClient ? renderTimetable : renderPlaceholder}
        </Link>
      </ErrorBoundary>
    </div>
  );
}
