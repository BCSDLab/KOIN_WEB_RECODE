import React from 'react';
import { cn } from '@bcsdlab/utils';
import useBusDirection from 'pages/BusPage/hooks/useBusDirection';
import useBusLeftTime from 'pages/BusPage/hooks/useBusLeftTime';
import { getBusName, getLeftTimeString, getStartTimeString } from 'pages/BusPage/ts/busModules';
import { BUS_DIRECTIONS, BUS_TYPES } from 'static/bus';
import useLogger from 'utils/hooks/analytics/useLogger';
import styles from './BusLookUp.module.scss';

function BusLookUp() {
  const { depart, arrival } = useBusDirection(BUS_DIRECTIONS);
  const { data: busData } = useBusLeftTime({
    departList: [depart.value, depart.value, depart.value],
    arrivalList: [arrival.value, arrival.value, arrival.value],
  });
  const logger = useLogger();

  return (
    <div className={styles.lookup}>
      <h1 className={styles.lookup__title}>버스 / 교통 운행정보</h1>
      <div className={styles.lookup__description}>
        <h2 className={styles.lookup__subtitle}>
          어디를 가시나요?
          <br />
          운행수단별로 간단히 비교해드립니다.
        </h2>
        <div className={styles['lookup__select-line']}>
          <select
            className={styles.lookup__select}
            onChange={depart.handleChange}
            value={depart.value}
            onClick={() => logger.actionEventClick({ actionTitle: 'CAMPUS', title: 'bus_departure', value: depart.value })}
          >
            {depart.options.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
          에서
          <select
            className={styles.lookup__select}
            onChange={arrival.handleChange}
            value={arrival.value}
            onClick={() => logger.actionEventClick({ actionTitle: 'CAMPUS', title: 'bus_arrival', value: arrival.value })}
          >
            {arrival.options.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
          갑니다
        </div>
      </div>
      <div className={styles.cards}>
        {BUS_TYPES.map(({ key: type }, idx) => (
          <React.Fragment key={type}>
            <div className={cn({ [styles['cards__top-card']]: true, [styles[`cards__card--${type}`]]: true })}>
              <div className={styles.cards__content}>
                <div>
                  <div className={styles.cards__direction}>
                    <span className={styles.cards__badge}>
                      출발
                    </span>
                    {depart.options[0]}
                  </div>
                  <div className={styles.cards__direction}>
                    <span className={styles.cards__badge}>
                      도착
                    </span>
                    {arrival.options[0]}
                  </div>
                </div>
                {busData[idx]?.now_bus?.bus_number && (
                  <span className={styles['cards__bus-number']}>{`${busData[idx]?.now_bus?.bus_number}번 버스`}</span>
                )}
              </div>
              <div className={cn({ [styles['cards__content--description']]: true, [styles.cards__content]: true })}>
                <div>
                  <span className={styles.cards__time}>
                    {getLeftTimeString(busData[idx]?.now_bus?.remain_time)}
                  </span>
                  {typeof busData[idx]?.now_bus?.remain_time === 'number' && (
                  <span className={styles.cards__detail}>
                    {`(${getStartTimeString(busData[idx]?.now_bus?.remain_time)} 출발)`}
                  </span>
                  )}
                </div>
                <div>
                  <img className={styles['cards__bus-icon']} src="https://static.koreatech.in/assets/img/bus_icon-white.png" alt="" />
                  <span className={styles['cards__bus-type']}>{getBusName(type)}</span>
                </div>
              </div>
            </div>
            <div className={cn({ [styles['cards__bottom-card']]: true, [styles[`cards__card--${type}`]]: true })}>
              <div className={styles.cards__content}>
                <span className={styles['cards__title--bottom']}>다음버스</span>
                {busData[idx]?.next_bus?.bus_number && (
                  <span className={styles['cards__bus-number']}>{`${busData[idx]?.next_bus?.bus_number}번 버스`}</span>
                )}
              </div>
              <div className={styles.cards__content}>
                <div>
                  <span className={styles.cards__time}>
                    {getLeftTimeString(busData[idx]?.next_bus?.remain_time)}
                  </span>
                  {typeof busData[idx]?.next_bus?.remain_time === 'number' && (
                  <span className={styles.cards__detail}>
                    {`(${getStartTimeString(busData[idx]?.next_bus?.remain_time)} 출발)`}
                  </span>
                  )}
                </div>
                <div>
                  <img className={styles['cards__bus-icon']} src="https://static.koreatech.in/assets/img/bus_icon-white.png" alt="" />
                  <span className={styles['cards__bus-type']}>{getBusName(type)}</span>
                </div>
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default BusLookUp;
