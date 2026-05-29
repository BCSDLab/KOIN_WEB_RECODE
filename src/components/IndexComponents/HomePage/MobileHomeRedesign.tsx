import type { ReactNode } from 'react';
import Link from 'next/link';
import ArrowRightIcon from 'assets/svg/common/arrow-right-icon.svg';
import BusTimeIcon from 'assets/svg/common/bus-time-icon.svg';
import ForkKnifeIcon from 'assets/svg/common/fork-knife-icon.svg';
import QRCodeIcon from 'assets/svg/common/qr-code-icon.svg';
import BusRouteIcon from 'assets/svg/common/route-icon.svg';
import SunIcon from 'assets/svg/common/sun-icon.svg';
import VanIcon from 'assets/svg/common/van-icon.svg';
import { BUS_LINKS } from 'static/bus';
import ROUTES from 'static/routes';
import { ORDER_BASE_URL } from 'static/url';
import styles from './MobileHomeRedesign.module.scss';

const mealCards = ['A코너', 'A코너', 'A코너'];
const mealTabs = ['A코너', 'B코너', 'C코너', '능수관'];

const unibus = BUS_LINKS[2];
const mobileStoreLink = `${ORDER_BASE_URL}/shops/?category=1`;

const transportCards = [
  {
    href: ROUTES.BusCourseShuttle(),
    title: '버스 시간표',
    description: '노선 별 출발 시간',
    Icon: BusTimeIcon,
  },
  {
    href: ROUTES.BusRoute(),
    title: '버스 노선 조회',
    description: '가장 빠른 버스 찾기',
    Icon: BusRouteIcon,
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
  return (
    <main className={styles.template}>
      <section className={styles.hero} aria-labelledby="home-greeting-title">
        <div className={styles.hero__meta}>
          <span className={styles.hero__date}>5월 31일 목요일</span>
          <span className={styles.weather}>
            <SunIcon className={styles.weather__icon} aria-hidden />
            <span className={styles.weather__text}>맑음 18°</span>
          </span>
        </div>
        <h1 id="home-greeting-title" className={styles.hero__title}>
          <span>BCSD님,</span>
          <span>오늘도 잘 챙겨먹어요</span>
        </h1>
      </section>

      <section className={styles.section} aria-labelledby="today-menu-title">
        <SectionHeader titleId="today-menu-title" title="오늘의 식단">
          <Link href={ROUTES.Cafeteria()} className={styles['section-link']}>
            <span>전체보기</span>
            <ArrowRightIcon aria-hidden />
          </Link>
        </SectionHeader>

        <div className={styles['meal-carousel']} aria-label="오늘의 식단 목록">
          {mealCards.map((corner, index) => (
            <article className={styles['meal-card']} key={`${corner}-${index}`}>
              <div className={styles['meal-card__meta']}>
                <span>07:30 - 09:00</span>
                <span>
                  ₩5,000 · <strong>620kcal</strong>
                </span>
              </div>
              <h3 className={styles['meal-card__title']}>{corner}</h3>
              <p className={styles['meal-card__menu']}>계란말이 · 북엇국 · 시금치나물 · 깍두기qweqe</p>
              <p className={styles['meal-card__menu']}>계란말이 · 북엇국 · 시금치나물깍두기 ...</p>
            </article>
          ))}
        </div>

        <div className={styles['meal-tabs']} aria-label="식당 코너 선택">
          {mealTabs.map((tab, index) => (
            <button
              type="button"
              className={`${styles['meal-tabs__button']} ${index === 0 ? styles['meal-tabs__button--active'] : ''}`}
              key={tab}
            >
              {tab}
            </button>
          ))}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="transport-title">
        <SectionHeader titleId="transport-title" title="교통">
          <Link href={unibus.link} className={styles['ticket-card']} target="_blank" rel="noreferrer">
            <span className={styles['ticket-card__text']}>
              <strong>셔틀 탑승권</strong>
              <span>QR 조회</span>
            </span>
            <QRCodeIcon aria-hidden />
          </Link>
        </SectionHeader>

        <Link href={ROUTES.Callvan()} className={styles['callvan-card']}>
          <span className={`${styles['icon-box']} ${styles['callvan-card__icon']}`} aria-hidden>
            <VanIcon />
          </span>
          <span className={styles['callvan-card__content']}>
            <span className={styles['callvan-card__title-row']}>
              <span className={styles['callvan-card__title']}>콜밴팟</span>
              <span className={styles['callvan-card__badge']}>14건 모집중</span>
            </span>
            <span className={styles['callvan-card__description']}>같이 콜밴 탈 사람을 찾아요</span>
          </span>
          <span className={styles['callvan-card__action']}>모집 보기</span>
        </Link>

        <div className={styles['transport-grid']}>
          {transportCards.map(({ href, title, description, Icon }) => (
            <Link href={href} className={styles['transport-card']} key={href}>
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
          <Link href={mobileStoreLink} className={styles['section-link']}>
            <span>전체보기</span>
            <ArrowRightIcon aria-hidden />
          </Link>
        </SectionHeader>

        <Link href={mobileStoreLink} className={styles['store-card']}>
          <span className={styles['store-card__content']}>
            <span className={styles['store-card__badge']}>KOIN 전용 이벤트 3곳</span>
            <span className={styles['store-card__title']}>
              많이 찾는 상점
              <br />
              둘러보기
            </span>
            <span className={styles['store-card__meta']}>
              영업중 <span className={styles['store-card__count']}>24곳</span> | 전체 72곳
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
