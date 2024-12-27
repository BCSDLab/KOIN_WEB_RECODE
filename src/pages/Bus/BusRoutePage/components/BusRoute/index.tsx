import BusIcon from 'assets/svg/Bus/bus-icon-28x28.svg';
import { SHORT_BUS_TYPE_MAP } from 'pages/Bus/BusRoutePage/constants/busType';
import { cn } from '@bcsdlab/utils';
import { Schedule } from 'pages/Bus/BusRoutePage/ts/types';
import { formatTimeDifference, formatTimeWithSeconds } from 'pages/Bus/BusRoutePage/utils/timeModule';
import styles from './BusRoute.module.scss';

interface BusRouteProps {
  schedule: Schedule;
}

export default function BusRoute({ schedule }: BusRouteProps) {
  const { busType, busName, departTime } = schedule;

  return (
    <div className={styles.box}>
      <div className={styles['route-info']}>
        <div className={styles['bus-type']}>
          <div className={styles['bus-type__icon']}>
            <BusIcon />
          </div>
          <div
            className={cn({
              [styles['bus-type__name']]: true,
              [styles[`bus-type__name--${busType}`]]: true,
            })}
          >
            {SHORT_BUS_TYPE_MAP[busType]}
          </div>
        </div>
        <div className={styles['depart-time']}>
          {`${Number(departTime.slice(0, 2)) < 12 ? '오전' : '오후'} ${departTime.slice(0, 5)}`}
        </div>
      </div>
      <div className={styles['before-arrive']}>
        {busType === 'city' && (
          <span className={styles['before-arrive__route-name']}>
            {`${busName}번`}
          </span>
        )}
        <span className={styles['before-arrive__text']}>
          {formatTimeDifference(departTime, formatTimeWithSeconds(new Date()))}
        </span>
      </div>
    </div>
  );
}
