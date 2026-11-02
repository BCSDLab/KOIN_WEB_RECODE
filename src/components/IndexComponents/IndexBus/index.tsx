import Link from 'next/link';

import { cn } from '@bcsdlab/utils';
import ArrowRightIcon from 'assets/svg/common/arrow-right-icon.svg';
import BusTimetableIcon from 'assets/svg/common/bus-time-icon.svg';
import BusRouteIcon from 'assets/svg/common/route-icon.svg';
import CallvanIcon from 'assets/svg/common/van-icon.svg';
import ChevronRight from 'assets/svg/IndexPage/Bus/chevron-right.svg';
import QRCode from 'assets/svg/IndexPage/Bus/qr-code.svg';
import IconBox from 'components/ui/IconBox';
import { type BusLinkKey, BUS_LINKS } from 'static/bus';
import ROUTES from 'static/routes';
import useLogger from 'utils/hooks/analytics/useLogger';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';

import styles from './IndexBus.module.scss';

const loggingTitle = {
  timetable: 'main_bus_timetable',
  route: 'main_bus_search',
  unibus: 'shuttle_ticket',
};

const loggingValue = {
  timetable: '버스 시간표 바로가기',
  route: '가장 빠른 버스 조회하기',
  unibus: '셔틀 탑승권',
};

const DESKTOP_TRANSPORT_LINKS = [
  {
    key: 'callvan',
    title: '콜밴팟',
    subtitle: '같이 콜밴 탈 사람찾기',
    link: ROUTES.Callvan(),
    SvgIcon: CallvanIcon,
    logging: { event_label: 'main_callvan_view', value: '' },
  },
  {
    ...BUS_LINKS[0],
    subtitle: '노선 별 출발 시간',
    SvgIcon: BusTimetableIcon,
    logging: { event_label: loggingTitle.timetable, value: loggingValue.timetable },
  },
  {
    ...BUS_LINKS[1],
    title: '버스 노선 조회',
    subtitle: '가장 빠른 버스 찾기',
    SvgIcon: BusRouteIcon,
    logging: { event_label: loggingTitle.route, value: loggingValue.route },
  },
];

function IndexBus() {
  const isMobile = useMediaQuery();
  const logger = useLogger();
  const logShuttleTicket = () =>
    logger.actionEventClick({ team: 'CAMPUS', event_label: 'shuttle_ticket', value: '셔틀 탑승권' });
  const logMainToBus = () => logger.actionEventClick({ team: 'CAMPUS', event_label: 'main_to_bus', value: '버스' });
  const logMainBusButton = (key: BusLinkKey) =>
    logger.actionEventClick({ team: 'CAMPUS', event_label: loggingTitle[key], value: loggingValue[key] });

  const unibus = BUS_LINKS[2];

  return (
    <section className={styles.template}>
      <div className={styles.template__header}>
        <Link className={styles.template__title} href={ROUTES.BusRoute()} onClick={logMainToBus}>
          {isMobile ? '버스' : '교통'}
        </Link>
        {isMobile && (
          <Link href={unibus.link} className={styles.unibus} onClick={logShuttleTicket}>
            <QRCode />
            <span className={styles.unibus__title}>셔틀 탑승권</span>
          </Link>
        )}
      </div>
      {isMobile ? (
        <div className={styles.cards}>
          {BUS_LINKS.slice(0, 2).map(({ key, title, subtitle, link }) => (
            <Link href={link} key={key} className={styles.card} onClick={() => logMainBusButton(key)}>
              <div className={styles.card__guide}>
                <span className={styles.card__title}>{title}</span>
                <span className={styles.card__subtitle}>{subtitle}</span>
              </div>
              <ChevronRight />
            </Link>
          ))}
        </div>
      ) : (
        <div className={styles.cards}>
          {DESKTOP_TRANSPORT_LINKS.map(({ key, title, subtitle, link, SvgIcon, logging }) => (
            <Link
              href={link}
              key={key}
              className={cn({
                [styles.card]: true,
                [styles['card--callvan']]: key === 'callvan',
              })}
              onClick={() => logger.actionEventClick({ team: 'CAMPUS', ...logging })}
            >
              <div className={styles.card__segment}>
                <IconBox className={styles.card__icon}>
                  <SvgIcon aria-hidden />
                </IconBox>
                <div className={styles.card__guide}>
                  <span className={styles.card__title}>{title}</span>
                  <span className={styles.card__subtitle}>{subtitle}</span>
                </div>
              </div>
              <ArrowRightIcon className={styles.card__arrow} aria-hidden />
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

export default IndexBus;
