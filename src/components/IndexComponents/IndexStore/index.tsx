import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { useSuspenseQuery } from '@tanstack/react-query';
import type { StoreCategoriesResponse } from 'api/store/entity';
import { storeQueries } from 'api/store/queries';
import ArrowRightIcon from 'assets/svg/common/arrow-right-icon.svg';
import ForkKnifeIcon from 'assets/svg/common/fork-knife-icon.svg';
import { getMainDurationTime, initializeMainEntryTime } from 'components/Store/utils/durationTime';
import IconBox from 'components/ui/IconBox';
import type { LoggingTeam } from 'lib/gtag';
import ROUTES from 'static/routes';
import useLogger from 'utils/hooks/analytics/useLogger';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';

import styles from './IndexStore.module.scss';

interface Category {
  id: number;
  name: string;
  image_url: string;
}

interface CategoryWithEvent extends Category {
  event: {
    team: LoggingTeam;
    event_label: string;
    value: string;
    previous_page: string;
    current_page: string;
  };
  route: string;
}

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

export default function IndexStore({ categories }: { categories: StoreCategoriesResponse }) {
  const logger = useLogger();
  const router = useRouter();
  const isMobile = useMediaQuery();

  const categoriesWithEvent = categories.shop_categories.map((category: Category) => ({
    ...category,
    event: {
      team: 'BUSINESS' as const,
      event_label: 'main_shop_categories',
      value: category.name,
      previous_page: '메인',
      current_page: category.name,
    },
    route: `${ROUTES.Store()}?category=${category.id}`,
  }));

  const titleLink = `${ROUTES.Store()}?category=1`;

  const handleCategoryClick = ({ event, route }: CategoryWithEvent) => {
    logger.actionEventClick({
      ...event,
      duration_time: getMainDurationTime(),
    });

    if (route.startsWith('http')) {
      window.location.assign(route);

      return;
    }

    router.push(route);
  };

  useEffect(() => {
    initializeMainEntryTime();
  }, []);

  return (
    <section className={styles.template}>
      <Link href={titleLink} className={styles.template__title}>
        주변 상점
      </Link>
      {isMobile ? (
        <div className={styles.category__wrapper}>
          {categoriesWithEvent.map((category) => (
            <button
              key={category.id}
              className={styles.category__item}
              onClick={() => handleCategoryClick(category)}
              type="button"
            >
              <Image
                src={category.image_url}
                alt={category.name}
                className={styles.category__image}
                width={48}
                height={48}
                sizes="48px"
              />
              {category.name}
            </button>
          ))}
        </div>
      ) : (
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
      )}
    </section>
  );
}
