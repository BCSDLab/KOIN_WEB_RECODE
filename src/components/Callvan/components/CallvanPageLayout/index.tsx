import { useCallback, useState } from 'react';
import { useRouter } from 'next/router';
import { CallvanLocation, CallvanSort, CallvanStatus } from 'api/callvan/entity';
import ArrowBackIcon from 'assets/svg/Callvan/arrow-back.svg';
import CarIcon from 'assets/svg/Callvan/car.svg';
import FilterIcon from 'assets/svg/Callvan/filter.svg';
import NotificationIcon from 'assets/svg/Callvan/notification.svg';
import SearchIcon from 'assets/svg/Callvan/search.svg';
import CallvanFilterPanel from 'components/Callvan/components/CallvanFilterPanel';
import useCallvanNotifications from 'components/Callvan/hooks/useCallvanNotifications';
import ROUTES from 'static/routes';
import styles from './CallvanPageLayout.module.scss';

interface CallvanPageLayoutProps {
  children: React.ReactNode;
  statuses: CallvanStatus[];
  departures: CallvanLocation[];
  arrivals: CallvanLocation[];
  sort: CallvanSort;
  title: string;
  onTitleChange: (title: string) => void;
}

export default function CallvanPageLayout({
  children,
  statuses,
  departures,
  arrivals,
  sort,
  title,
  onTitleChange,
}: CallvanPageLayoutProps) {
  const router = useRouter();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { data: notifications } = useCallvanNotifications();

  const hasUnreadNotifications = notifications?.some((n) => !n.is_read) ?? false;

  const hasActiveFilter = statuses.length > 0 || departures.length > 0 || arrivals.length > 0 || sort !== 'LATEST_DESC';

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleApply = useCallback(
    (filter: {
      statuses: CallvanStatus[];
      departures: CallvanLocation[];
      arrivals: CallvanLocation[];
      sort: CallvanSort;
    }) => {
      router.push({
        pathname: router.pathname,
        query: {
          ...router.query,
          statuses: filter.statuses.length > 0 ? filter.statuses.join(',') : undefined,
          departures: filter.departures.length > 0 ? filter.departures.join(',') : undefined,
          arrivals: filter.arrivals.length > 0 ? filter.arrivals.join(',') : undefined,
          sort: filter.sort !== 'LATEST_DESC' ? filter.sort : undefined,
          page: undefined,
        },
      });
    },
    [router],
  );

  const handleSearch = useCallback(() => {
    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        title: title.trim() || undefined,
        page: undefined,
      },
    });
  }, [router, title]);

  return (
    <div className={styles.layout}>
      <div className={styles.layout__header}>
        <button type="button" className={styles['layout__back-button']} onClick={handleBack} aria-label="뒤로가기">
          <ArrowBackIcon />
        </button>
        <h1 className={styles.layout__title}>콜밴팟</h1>
        <button
          type="button"
          className={styles['layout__notification-button']}
          onClick={() => router.push(ROUTES.CallvanNotifications())}
          aria-label="알림"
        >
          <NotificationIcon />
          {hasUnreadNotifications && <span className={styles['layout__notification-dot']} />}
        </button>
      </div>

      <div className={styles['layout__search-bar']}>
        <div className={styles['layout__search-input']}>
          <input
            type="text"
            className={styles['layout__search-field']}
            placeholder="검색어를 입력해주세요."
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch();
            }}
          />
          <button type="button" className={styles['layout__search-button']} onClick={handleSearch} aria-label="검색">
            <SearchIcon />
          </button>
        </div>
        <button
          type="button"
          className={`${styles['layout__filter-button']} ${hasActiveFilter ? styles['layout__filter-button--active'] : ''}`}
          onClick={() => setIsFilterOpen(true)}
        >
          <span className={styles['layout__filter-label']}>필터</span>
          <span className={styles['layout__filter-icon']}>
            <FilterIcon />
          </span>
        </button>
      </div>

      <div className={styles.layout__content}>{children}</div>

      <button type="button" className={styles.layout__fab} aria-label="모집하기" onClick={() => router.push(ROUTES.CallvanAdd())}>
        <CarIcon />
        <span className={styles['layout__fab-label']}>모집하기</span>
      </button>

      <CallvanFilterPanel
        key={String(isFilterOpen)}
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        statuses={statuses}
        departures={departures}
        arrivals={arrivals}
        sort={sort}
        onApply={handleApply}
      />
    </div>
  );
}
