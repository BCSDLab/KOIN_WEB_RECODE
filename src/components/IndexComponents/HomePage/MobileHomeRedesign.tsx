import type { ReactNode } from 'react';
import Link from 'next/link';

import { useSuspenseQuery } from '@tanstack/react-query';
import { callvanQueries } from 'api/callvan/queries';
import ArrowRightIcon from 'assets/svg/common/arrow-right-icon.svg';
import BusTimeIcon from 'assets/svg/common/bus-time-icon.svg';
import QRCodeIcon from 'assets/svg/common/qr-code-icon.svg';
import BusRouteIcon from 'assets/svg/common/route-icon.svg';
import VanIcon from 'assets/svg/common/van-icon.svg';
import IndexMobileCafeteria from 'components/IndexComponents/IndexMobileCafeteria';
import StoreCard from 'components/IndexComponents/IndexStore/StoreCard';
import IconBox from 'components/ui/IconBox';
import { BUS_LINKS } from 'static/bus';
import ROUTES from 'static/routes';
import useLogger from 'utils/hooks/analytics/useLogger';

import HomeGreeting from './HomeGreeting';
import styles from './MobileHomeRedesign.module.scss';

const unibus = BUS_LINKS[2];
const mobileStoreLink = `${ROUTES.Store()}?category=1`;

const transportCards = [
  {
    href: ROUTES.BusCourseShuttle(),
    title: '버스 시간표',
    description: '노선 별 출발 시간',
    Icon: BusTimeIcon,
    logging: {
      event_label: 'bus_timetable',
      value: '버스 시간표 조회하기',
    },
  },
  {
    href: ROUTES.BusRoute(),
    title: '버스 노선 조회',
    description: '가장 빠른 버스 찾기',
    Icon: BusRouteIcon,
    logging: {
      event_label: 'bus_route',
      value: '버스 노선 조회하기',
    },
  },
];

interface SectionHeaderProps {
  titleId: string;
  title: string;
  children: ReactNode;
}

function SectionHeader({ titleId, title, children }: SectionHeaderProps) {
  return (
    <div className={styles.section__header}>
      <h2 id={titleId} className={styles.section__title}>
        {title}
      </h2>
      {children}
    </div>
  );
}

function MobileHomeRedesign() {
  const logger = useLogger();
  const { data: callvanData } = useSuspenseQuery({
    ...callvanQueries.list({
      statuses: ['RECRUITING'],
      sort: 'LATEST_DESC',
      page: 1,
      limit: 1,
    }),
  });

  const logClick = (event_label: string, value: string) => {
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label,
      value,
    });
  };

  return (
    <main className={styles.template}>
      <HomeGreeting />

      <section className={styles.section} aria-labelledby="today-menu-title">
        <SectionHeader titleId="today-menu-title" title="오늘의 식단">
          <Link
            href={ROUTES.Cafeteria()}
            className={styles['section-link']}
            onClick={() => logClick('today_meal', '전체보기')}
          >
            <span>전체보기</span>
            <ArrowRightIcon aria-hidden />
          </Link>
        </SectionHeader>

        <IndexMobileCafeteria />
      </section>

      <section className={styles.section} aria-labelledby="transport-title">
        <SectionHeader titleId="transport-title" title="교통">
          <Link
            href={unibus.link}
            className={styles['ticket-card']}
            target="_blank"
            rel="noreferrer"
            onClick={() => logClick('shuttle_ticket', '셔틀 탑승권')}
          >
            <span className={styles['ticket-card__text']}>
              <strong>셔틀 탑승권</strong>
              <span>QR 조회</span>
            </span>
            <QRCodeIcon aria-hidden />
          </Link>
        </SectionHeader>

        <Link
          href={ROUTES.Callvan()}
          className={styles['callvan-card']}
          onClick={() => logClick('callvanpot', '콜밴팟 모집보기')}
        >
          <IconBox className={styles['callvan-card__icon']}>
            <VanIcon />
          </IconBox>
          <span className={styles['callvan-card__content']}>
            <span className={styles['callvan-card__title-row']}>
              <span className={styles['callvan-card__title']}>콜밴팟</span>
              <span className={styles['callvan-card__badge']}>{callvanData.total_count}건 모집중</span>
            </span>
            <span className={styles['callvan-card__description']}>같이 콜밴 탈 사람을 찾아요</span>
          </span>
          <span className={styles['callvan-card__action']}>모집 보기</span>
        </Link>

        <div className={styles['transport-grid']}>
          {transportCards.map(({ href, title, description, Icon, logging }) => (
            <Link
              href={href}
              className={styles['transport-card']}
              key={href}
              onClick={() => logClick(logging.event_label, logging.value)}
            >
              <IconBox>
                <Icon />
              </IconBox>
              <span className={styles['transport-card__content']}>
                <span className={styles['transport-card__title']}>{title}</span>
                <span className={styles['transport-card__description']}>{description}</span>
              </span>
              <span className={styles['transport-card__action']}>조회하기 →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="nearby-store-title">
        <SectionHeader titleId="nearby-store-title" title="주변 상점">
          <Link href={mobileStoreLink} className={styles['section-link']} onClick={() => logClick('shop', '전체보기')}>
            <span>전체보기</span>
            <ArrowRightIcon aria-hidden />
          </Link>
        </SectionHeader>

        <StoreCard href={mobileStoreLink} onClick={() => logClick('popular_shop', '많이 찾는 상점 둘러보기')} />
      </section>
    </main>
  );
}

export default MobileHomeRedesign;
