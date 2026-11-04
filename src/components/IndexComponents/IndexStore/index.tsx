import { Suspense, useEffect } from 'react';
import Link from 'next/link';

import { useSuspenseQuery } from '@tanstack/react-query';
import { storeQueries } from 'api/store/queries';
import ArrowRightIcon from 'assets/svg/common/arrow-right-icon.svg';
import ForkKnifeIcon from 'assets/svg/common/fork-knife-icon.svg';
import ErrorBoundary from 'components/boundary/ErrorBoundary';
import { getMainDurationTime, initializeMainEntryTime } from 'components/Store/utils/durationTime';
import IconBox from 'components/ui/IconBox';
import ROUTES from 'static/routes';
import useLogger from 'utils/hooks/analytics/useLogger';

import styles from './IndexStore.module.scss';

interface DesktopStoreCardProps {
  href: string;
  onClick: () => void;
}

function DesktopStoreCard({ href, onClick }: DesktopStoreCardProps) {
  const { data: storeCounts } = useSuspenseQuery(storeQueries.counts());
  const { data: storeEventCount } = useSuspenseQuery(storeQueries.eventCount());

  return (
    <Link href={href} className={styles['store-card']} onClick={onClick}>
      <div className={styles['store-card__content-wrapper']}>
        <IconBox className={styles['store-card__icon']}>
          <ForkKnifeIcon aria-hidden />
        </IconBox>
        <span className={styles['store-card__content']}>
          <span className={styles['store-card__badge']}>KOIN 전용 이벤트 {storeEventCount.count}곳</span>
          <span className={styles['store-card__title']}>
            많이 찾는 상점
            <br />
            둘러보기
          </span>
          <span className={styles['store-card__meta']}>
            영업중 <span className={styles['store-card__count']}>{storeCounts.open_count}곳</span> | 전체{' '}
            {storeCounts.total_count}곳
          </span>
        </span>
      </div>
      <span className={styles['store-card__arrow']}>
        <ArrowRightIcon aria-hidden />
      </span>
    </Link>
  );
}

export default function IndexStore() {
  const logger = useLogger();
  const titleLink = `${ROUTES.Store()}?category=1`;

  useEffect(() => {
    initializeMainEntryTime();
  }, []);

  return (
    <section className={styles.template}>
      <Link href={titleLink} className={styles.template__title}>
        주변 상점
      </Link>
      <ErrorBoundary fallbackClassName={styles['store-card']}>
        <Suspense
          fallback={
            <div className={styles['store-card']} role="status">
              상점 정보를 불러오는 중입니다.
            </div>
          }
        >
          <DesktopStoreCard
            href={titleLink}
            onClick={() =>
              logger.actionEventClick({
                team: 'CAMPUS',
                event_label: 'popular_shop',
                value: '많이 찾는 상점 둘러보기',
                duration_time: getMainDurationTime(),
              })
            }
          />
        </Suspense>
      </ErrorBoundary>
    </section>
  );
}
