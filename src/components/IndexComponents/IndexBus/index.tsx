import Link from 'next/link';

import { cn } from '@bcsdlab/utils';
import ArrowRightIcon from 'assets/svg/common/arrow-right-icon.svg';
import BusTimetableIcon from 'assets/svg/common/bus-time-icon.svg';
import BusRouteIcon from 'assets/svg/common/route-icon.svg';
import CallvanIcon from 'assets/svg/common/van-icon.svg';
import IconBox from 'components/ui/IconBox';
import ROUTES from 'static/routes';
import useLogger from 'utils/hooks/analytics/useLogger';

import styles from './IndexBus.module.scss';

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
    key: 'timetable',
    title: '버스 시간표',
    subtitle: '노선 별 출발 시간',
    link: ROUTES.BusCourseShuttle(),
    SvgIcon: BusTimetableIcon,
    logging: { event_label: 'main_bus_timetable', value: '버스 시간표 바로가기' },
  },
  {
    key: 'route',
    title: '버스 노선 조회',
    subtitle: '가장 빠른 버스 찾기',
    link: ROUTES.BusRoute(),
    SvgIcon: BusRouteIcon,
    logging: { event_label: 'main_bus_search', value: '가장 빠른 버스 조회하기' },
  },
];

function IndexBus() {
  const logger = useLogger();
  const logMainToBus = () => logger.actionEventClick({ team: 'CAMPUS', event_label: 'main_to_bus', value: '버스' });

  return (
    <section className={styles.template}>
      <div className={styles.template__header}>
        <Link className={styles.template__title} href={ROUTES.BusRoute()} onClick={logMainToBus}>
          교통
        </Link>
      </div>
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
    </section>
  );
}

export default IndexBus;
