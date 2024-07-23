import { Link, useNavigate } from 'react-router-dom';
import useBusLeftTime from 'pages/BusPage/hooks/useBusLeftTime';
import {
  BUS_DIRECTIONS, BUS_TYPES, BusLink, busLink,
} from 'static/bus';
import { cn } from '@bcsdlab/utils';
import { getLeftTimeString, getStartTimeString, directionToEnglish } from 'pages/BusPage/ts/busModules';
import useLogger from 'utils/hooks/useLogger';
import { ReactComponent as RightArrow } from 'assets/svg/right-arrow.svg';
import { ReactComponent as ReverseDestination } from 'assets/svg/reverse-destination.svg';
import { useBusStore } from 'utils/zustand/bus';
import styles from './IndexBus.module.scss';
import useIndexBusDirection from './hooks/useIndexBusDirection';
import useMobileBusCarousel from './hooks/useMobileBusCarousel';

function IndexBus() {
  const { toSchoolList, toggleDirection } = useIndexBusDirection();
  const { data: busData } = useBusLeftTime({
    departList: toSchoolList.map((depart) => directionToEnglish(BUS_DIRECTIONS[Number(depart)])),
    arrivalList: toSchoolList.map((depart) => directionToEnglish(BUS_DIRECTIONS[Number(!depart)])),
  });
  const {
    isMobile, sliderRef, mobileBusTypes, matchToMobileType,
  } = useMobileBusCarousel();
  const logger = useLogger();
  const setSelectedTab = useBusStore((state) => state.setSelectedTab);
  const navigate = useNavigate();

  const getRedirection = (type: string): BusLink => {
    const links = matchToMobileType(busLink);
    return links.find((link) => link.key === type) || {
      label: '시간표 보러가기', link: '/bus', key: 'shuttle', type: BUS_TYPES[0],
    };
  };

  const handleRedirectionClick = (link: string, key: string) => {
    if (link.includes('https')) {
      window.open(link, '_blank');
    } else {
      const selectedTab = BUS_TYPES.find((busType) => busType.key === key);
      if (selectedTab) {
        setSelectedTab(selectedTab);
      }
      navigate(link);
    }
  };

  return (
    <section className={styles.template}>
      <Link
        to="/bus"
        className={styles.template__title}
        onClick={() => {
          setSelectedTab(BUS_TYPES[0]);
          logger.actionEventClick({ actionTitle: 'CAMPUS', title: 'main_bus', value: '버스' });
        }}
      >
        버스/교통
      </Link>
      <div className={styles.cards} ref={sliderRef}>
        {busData && matchToMobileType(BUS_TYPES).map(({ key: type, tabName }, idx) => (
          <div
            key={type}
            className={cn({
              [styles.cards__card]: true,
              [styles['cards__card--sm']]: idx !== 1,
            })}
          >
            <div className={cn({ [styles.cards__head]: true, [styles[`cards__head--${type}`]]: true })}>
              <img className={styles['cards__bus-icon']} src="http://static.koreatech.in/assets/img/ic-bus.png" alt="" />
              {tabName}
            </div>
            <div className={styles.cards__body}>
              <span className={styles['cards__remain-time']}>
                {getLeftTimeString(matchToMobileType(busData)[idx]?.now_bus?.remain_time)}
              </span>
              {!isMobile
              && (
              <span className={styles.cards__detail}>
                {typeof busData[idx]?.now_bus?.remain_time === 'number' && (
                  `${getStartTimeString(busData[idx]?.now_bus?.remain_time, true)} 출발`
                )}
              </span>
              )}
              <div className={styles.cards__directions}>
                <span>{BUS_DIRECTIONS[Number(matchToMobileType(toSchoolList)[idx])]}</span>
                <button
                  type="button"
                  aria-label="목적지 변경"
                  onClick={() => {
                    toggleDirection(isMobile ? mobileBusTypes[idx] : idx);
                    logger.actionEventClick({ actionTitle: 'CAMPUS', title: 'main_bus_changeToFrom', value: BUS_TYPES[idx].tabName });
                  }}
                  className={styles.cards__toggle}
                >
                  <ReverseDestination className={styles['cards__toggle--image']} />
                </button>
                <span>{BUS_DIRECTIONS[Number(!matchToMobileType(toSchoolList)[idx])]}</span>
              </div>
              <button className={styles.cards__redirect} onClick={() => handleRedirectionClick(getRedirection(type).link, type)} type="button">
                {getRedirection(type).label}
                <RightArrow />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default IndexBus;
