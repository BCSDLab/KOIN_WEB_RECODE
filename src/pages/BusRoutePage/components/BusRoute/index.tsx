import BusIcon from 'assets/svg/Bus/bus-icon.svg';
import { SHORT_BUS_TYPE_MAP } from 'pages/BusRoutePage/ts/busModules';
import { cn } from '@bcsdlab/utils';
import { Schedule } from 'pages/BusRoutePage/ts/types';
import { formatTimeDifference, getTimeDifference } from 'pages/BusRoutePage/ts/timeModule';
import styles from './BusRoute.module.scss';

interface BusRouteProps {
  schedule: Schedule;
  isSameDay: boolean;
  departTime: string; // HH:mm:ss
}

export default function BusRoute({
  schedule, isSameDay, departTime: selectedDepartTime,
}: BusRouteProps) {
  const { busType, busName, departTime } = schedule;

  const timeDiff = getTimeDifference(departTime, selectedDepartTime);
  const isWithin4Hours = timeDiff.hours < 4;

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
          {`${Number(departTime.slice(0, 2)) > 12 ? '오전' : '오후'} ${departTime.slice(0, 5)}`}
        </div>
      </div>
      <div className={styles['before-arrive']}>
        {busType === 'city' && (
          <span className={styles['before-arrive__route-name']}>
            {`${busName}번`}
          </span>
        )}
        <span className={styles['before-arrive__text']}>
          {isSameDay && isWithin4Hours
            ? formatTimeDifference(departTime, selectedDepartTime)
            : ''}
        </span>
      </div>
    </div>
  );
}
