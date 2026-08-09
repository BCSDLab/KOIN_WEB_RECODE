import Link from 'next/link';
import { isValidTimetableFrameId } from 'api/timetable/queries';
import ErrorBoundary from 'components/boundary/ErrorBoundary';
import Timetable from 'components/TimetablePage/components/Timetable';
import TimetableGridPlaceholder from 'components/TimetablePage/components/TimetableGridPlaceholder';
import useTimetableFrameList from 'components/TimetablePage/hooks/useTimetableFrameList';
import ROUTES from 'static/routes';
import useLogger from 'utils/hooks/analytics/useLogger';
import useTokenState from 'utils/hooks/state/useTokenState';
import type { Semester } from 'api/timetable/entity';
import styles from './IndexTimetable.module.scss';

interface IndexTimeTableProps {
  serverSemester: Semester;
}

/**
 * 학기는 서버가 확정한 값을 그대로 쓴다.
 *
 * 이전에는 스토어의 날짜 파생 기본값(getRecentSemester)으로 렌더한 뒤 useEffect에서
 * 사용자 학기로 바꿨다. 학기가 쿼리 키에 들어가므로 그 순간 시간표가 통째로 교체된다.
 * 메인 화면이 전역 학기 스토어를 건드리던 부수효과도 함께 사라진다.
 */
export default function IndexTimeTable({ serverSemester }: IndexTimeTableProps) {
  const logger = useLogger();
  const semester = serverSemester;
  const token = useTokenState();
  const { data: timetableFrameList } = useTimetableFrameList(token, semester);

  const currentFrameId = timetableFrameList?.find((frame) => frame.is_main)?.id;
  const hasValidCurrentFrameId = isValidTimetableFrameId(currentFrameId);

  const renderPlaceholder = (
    <TimetableGridPlaceholder
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
          {renderTimetable}
        </Link>
      </ErrorBoundary>
    </div>
  );
}
