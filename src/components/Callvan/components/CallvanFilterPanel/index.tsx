import { useCallback, useEffect, useRef, useState } from 'react';
import {
  CallvanAuthor,
  CallvanLocation,
  CallvanSort,
  CallvanStatus,
  CALLVAN_LOCATION_LABEL,
} from 'api/callvan/entity';
import SpinIcon from 'assets/svg/Callvan/spin.svg';
import CloseIcon from 'assets/svg/close-icon-black.svg';
import StatusBadge from 'components/Callvan/components/StatusBadge';
import useLogger from 'utils/hooks/analytics/useLogger';
import styles from './CallvanFilterPanel.module.scss';

const STATUS_OPTIONS: { value: CallvanStatus; label: string }[] = [
  { value: 'RECRUITING', label: '모집중' },
  { value: 'CLOSED', label: '모집마감' },
];

const SORT_OPTIONS: { value: CallvanSort; label: string }[] = [
  { value: 'LATEST_DESC', label: '최신순' },
  { value: 'DEPARTURE_ASC', label: '출발시각순' },
];

const CALLVAN_FILTER_LOCATIONS: CallvanLocation[] = [
  'FRONT_GATE',
  'BACK_GATE',
  'DORMITORY_MAIN',
  'DORMITORY_SUB',
  'TERMINAL',
  'STATION',
  'ASAN_STATION',
];

interface CallvanFilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  statuses: CallvanStatus[];
  departures: CallvanLocation[];
  arrivals: CallvanLocation[];
  sort: CallvanSort;
  author: CallvanAuthor;
  joined: boolean;
  onApply: (filter: {
    statuses: CallvanStatus[];
    departures: CallvanLocation[];
    arrivals: CallvanLocation[];
    sort: CallvanSort;
    author: CallvanAuthor;
    joined: boolean;
  }) => void;
}

export default function CallvanFilterPanel({
  isOpen,
  onClose,
  statuses,
  departures,
  arrivals,
  sort,
  author,
  joined,
  onApply,
}: CallvanFilterPanelProps) {
  const [localStatuses, setLocalStatuses] = useState<CallvanStatus[]>(statuses);
  const [localDepartures, setLocalDepartures] = useState<CallvanLocation[]>(departures);
  const [localArrivals, setLocalArrivals] = useState<CallvanLocation[]>(arrivals);
  const [localSort, setLocalSort] = useState<CallvanSort>(sort);
  const [localAuthor, setLocalAuthor] = useState<CallvanAuthor>(author);
  const [localJoined, setLocalJoined] = useState<boolean>(joined);
  const panelRef = useRef<HTMLDivElement>(null);
  const logger = useLogger();

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const toggleStatus = useCallback((value: CallvanStatus) => {
    setLocalStatuses((prev) => {
      if (prev.includes(value)) return prev.filter((s) => s !== value);
      return [...prev, value];
    });
  }, []);

  const toggleDeparture = (value: CallvanLocation) => {
    setLocalDepartures((prev) => {
      if (prev.includes(value)) return prev.filter((l) => l !== value);
      const next = [...prev, value];
      return next.length === CALLVAN_FILTER_LOCATIONS.length ? [] : next;
    });
  }

  const toggleArrival = (value: CallvanLocation) => {
    setLocalArrivals((prev) => {
      if (prev.includes(value)) return prev.filter((l) => l !== value);
      const next = [...prev, value];
      return next.length === CALLVAN_FILTER_LOCATIONS.length ? [] : next;
    });
  }

  const handleApply = () => {
    onApply({
      statuses: localStatuses,
      departures: localDepartures,
      arrivals: localArrivals,
      sort: localSort,
      author: localAuthor,
      joined: localJoined,
    });
    onClose();
    logger.actionEventClick({ event_label: 'callvan_filter_apply', team: 'CAMPUS', value: '' });
  };

  const handleReset = () => {
    setLocalStatuses([]);
    setLocalDepartures([]);
    setLocalArrivals([]);
    setLocalSort('LATEST_DESC');
    setLocalAuthor('ALL');
    setLocalJoined(false);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className={styles.overlay} onClick={onClose} tabIndex={-1} role="presentation" />
      <div className={styles.panel} ref={panelRef} role="dialog" aria-label="필터">
        <div className={styles.panel__header}>
          <span className={styles['panel__header-title']}>필터</span>
          <button type="button" className={styles['panel__close-button']} onClick={onClose} aria-label="필터 닫기">
            <CloseIcon />
          </button>
        </div>

        <div className={styles.panel__body}>
          <section className={styles.section}>
            <h3 className={styles.section__title}>목록</h3>
            <div className={styles.section__badges}>
              <StatusBadge
                label="전체"
                isActive={localAuthor === 'ALL' && !localJoined}
                onClick={() => {
                  setLocalAuthor('ALL');
                  setLocalJoined(false);
                }}
              />
              <StatusBadge
                label="내 게시물"
                isActive={localAuthor === 'MY'}
                onClick={() => {
                  setLocalAuthor('MY');
                  setLocalJoined(false);
                }}
              />
              <StatusBadge
                label="참여중인 게시물"
                isActive={localJoined}
                onClick={() => {
                  setLocalJoined(true);
                  setLocalAuthor('ALL');
                }}
              />
            </div>
          </section>

          <hr className={styles.divider} />

          <section className={styles.section}>
            <h3 className={styles.section__title}>정렬</h3>
            <div className={styles.section__badges}>
              {SORT_OPTIONS.map((opt) => (
                <StatusBadge
                  key={opt.value}
                  label={opt.label}
                  isActive={localSort === opt.value}
                  onClick={() => setLocalSort(opt.value)}
                />
              ))}
            </div>
          </section>

          <hr className={styles.divider} />

          <section className={styles.section}>
            <h3 className={styles.section__title}>모집 상태</h3>
            <div className={styles.section__badges}>
              <StatusBadge
                label="전체"
                isActive={localStatuses.length === 0}
                onClick={() => setLocalStatuses([])}
              />
              {STATUS_OPTIONS.map((opt) => (
                <StatusBadge
                  key={opt.value}
                  label={opt.label}
                  isActive={localStatuses.includes(opt.value)}
                  onClick={() => toggleStatus(opt.value)}
                />
              ))}
            </div>
          </section>

          <hr className={styles.divider} />

          <section className={styles.section}>
            <div className={styles.section__header}>
              <h3 className={styles.section__title}>출발지</h3>
              <span className={styles.section__description}>기타 장소는 검색창을 이용해주세요.</span>
            </div>
            <div className={styles.section__badges}>
              <StatusBadge
                label="전체"
                isActive={localDepartures.length === 0}
                onClick={() => setLocalDepartures([])}
              />
              {CALLVAN_FILTER_LOCATIONS.map((loc) => (
                <StatusBadge
                  key={loc}
                  label={CALLVAN_LOCATION_LABEL[loc]}
                  isActive={localDepartures.includes(loc)}
                  onClick={() => toggleDeparture(loc)}
                />
              ))}
            </div>
          </section>

          <hr className={styles.divider} />

          <section className={styles.section}>
            <div className={styles.section__header}>
              <h3 className={styles.section__title}>도착지</h3>
              <span className={styles.section__description}>기타 장소는 검색창을 이용해주세요.</span>
            </div>
            <div className={styles.section__badges}>
              <StatusBadge
                label="전체"
                isActive={localArrivals.length === 0}
                onClick={() => setLocalArrivals([])}
              />
              {CALLVAN_FILTER_LOCATIONS.map((loc) => (
                <StatusBadge
                  key={loc}
                  label={CALLVAN_LOCATION_LABEL[loc]}
                  isActive={localArrivals.includes(loc)}
                  onClick={() => toggleArrival(loc)}
                />
              ))}
            </div>
          </section>

          <hr className={styles.divider} />
        </div>

        <div className={styles.panel__footer}>
          <button type="button" className={styles['panel__reset-button']} onClick={handleReset}>
            초기화
            <SpinIcon />
          </button>
          <button type="button" className={styles['panel__apply-button']} onClick={handleApply}>
            적용하기
          </button>
        </div>
      </div>
    </>
  );
}
