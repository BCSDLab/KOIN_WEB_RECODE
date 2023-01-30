import { Link } from 'react-router-dom';
import useBusLeftTIme from 'pages/BusPage/hooks/useBusLeftTime';
import { BUS_DIRECTIONS, BUS_TYPES } from 'static/bus';
import cn from 'utils/ts/classnames';
import { getLeftTimeString, getStartTimeString, directionToEnglish } from 'pages/BusPage/ts/busModules';
import styles from './IndexBus.module.scss';
import useIndexBusDirection from './hooks/useIndexBusDirection';
import useMobileBusCarousel from './hooks/useMobileBusCarousel';

function IndexBus() {
  const { toSchoolList, toggleDirection } = useIndexBusDirection();
  const { data: busData } = useBusLeftTIme({
    departList: toSchoolList.map((depart) => directionToEnglish(BUS_DIRECTIONS[Number(depart)])),
    arrivalList: toSchoolList.map((depart) => directionToEnglish(BUS_DIRECTIONS[Number(!depart)])),
  });
  const {
    isMobile, sliderRef, mobileBusTypes, matchToMobileType,
  } = useMobileBusCarousel();

  return (
    <section className={styles.template}>
      <Link to="/bus" className={styles.template__title}>버스/교통</Link>
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
                <button type="button" onClick={() => toggleDirection(isMobile ? mobileBusTypes[idx] : idx)} className={styles.cards__toggle}>
                  <img src="http://static.koreatech.in/assets/img/reverse_destination.png" alt="목적지 변경" className={styles['cards__toggle--image']} />
                </button>
                <span>{BUS_DIRECTIONS[Number(!matchToMobileType(toSchoolList)[idx])]}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default IndexBus;
