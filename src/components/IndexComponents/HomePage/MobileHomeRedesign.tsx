import type { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSuspenseQuery } from '@tanstack/react-query';
import { callvanQueries } from 'api/callvan/queries';
import { storeQueries } from 'api/store/queries';
import { weatherQueries } from 'api/weather/queries';
import ArrowRightIcon from 'assets/svg/common/arrow-right-icon.svg';
import BusTimeIcon from 'assets/svg/common/bus-time-icon.svg';
import ForkKnifeIcon from 'assets/svg/common/fork-knife-icon.svg';
import QRCodeIcon from 'assets/svg/common/qr-code-icon.svg';
import BusRouteIcon from 'assets/svg/common/route-icon.svg';
import VanIcon from 'assets/svg/common/van-icon.svg';
import IndexMobileCafeteria from 'components/IndexComponents/IndexMobileCafeteria';
import { BUS_LINKS } from 'static/bus';
import ROUTES from 'static/routes';
import { ORDER_BASE_URL } from 'static/url';
import useLogger from 'utils/hooks/analytics/useLogger';
import { useUser } from 'utils/hooks/state/useUser';
import styles from './MobileHomeRedesign.module.scss';

const unibus = BUS_LINKS[2];
const mobileStoreLink = `${ORDER_BASE_URL}/shops/?category=1`;
const dateFormatter = new Intl.DateTimeFormat('ko-KR', {
  month: 'long',
  day: 'numeric',
  weekday: 'long',
  timeZone: 'Asia/Seoul',
});

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
  const { data: userInfo } = useUser();
  const { data: weatherData } = useSuspenseQuery(weatherQueries.info());
  const { data: callvanData } = useSuspenseQuery({
    ...callvanQueries.list('', {
      statuses: ['RECRUITING'],
      sort: 'LATEST_DESC',
      page: 1,
      limit: 1,
    }),
  });
  const { data: storeCounts } = useSuspenseQuery(storeQueries.counts());
  const { data: storeEventCount } = useSuspenseQuery(storeQueries.eventCount());

  const displayName = userInfo?.nickname?.trim() || userInfo?.name?.trim() || '코리';
  const todayLabel = dateFormatter.format(new Date());

  const logClick = (event_label: string, value: string) => {
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label,
      value,
    });
  };

  return (
    <main className={styles.template}>
      <section className={styles.hero} aria-labelledby="home-greeting-title">
        <div className={styles.hero__meta}>
          <span className={styles.hero__date}>{todayLabel}</span>
          <span className={styles.weather}>
            <Image
              className={styles.weather__icon}
              src={weatherData.weather_icon_url}
              alt=""
              width={16}
              height={16}
              aria-hidden
            />
            <span className={styles.weather__text}>
              {weatherData.weather} {weatherData.temperature}°
            </span>
          </span>
        </div>
        <h1 id="home-greeting-title" className={styles.hero__title}>
          <span>{displayName}님,</span>
          <span>오늘도 잘 챙겨먹어요</span>
        </h1>
      </section>

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
          <span className={`${styles['icon-box']} ${styles['callvan-card__icon']}`} aria-hidden>
            <VanIcon />
          </span>
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
              <span className={styles['icon-box']} aria-hidden>
                <Icon />
              </span>
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

        <Link
          href={mobileStoreLink}
          className={styles['store-card']}
          onClick={() => logClick('popular_shop', '많이 찾는 상점 둘러보기')}
        >
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
          <span className={styles['store-card__side']} aria-hidden>
            <span className={styles['icon-box']} aria-hidden>
              <ForkKnifeIcon />
            </span>
            <ArrowRightIcon className={styles['store-card__arrow']} aria-hidden />
          </span>
        </Link>
      </section>
    </main>
  );
}

export default MobileHomeRedesign;
