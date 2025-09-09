import BusIcon from 'assets/svg/Bus/bus-icon-28x28.svg';
import { SHORT_BUS_TYPE_MAP } from 'components/Bus/BusRoutePage/constants/busType';
import { cn } from '@bcsdlab/utils';
import { Schedule } from 'components/Bus/BusRoutePage/ts/types';
import { formatTimeDifference, formatTimeWithSeconds, isToday } from 'components/Bus/BusRoutePage/utils/timeModule';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import styles from './BusRoute.module.scss';

interface BusRouteProps {
  departDate: string; // yyyy-MM-dd
  schedule: Schedule;
}

export default function BusRoute({ departDate, schedule }: BusRouteProps) {
  const isMobile = useMediaQuery();
  const { busType, busName, departTime } = schedule;

  return (
    <div className={styles.box}>
      <div className={styles['route-info']}>
        <div className={styles['bus-type']}>
          {!isMobile && (
            <div className={styles['bus-type__icon']}>
              <BusIcon />
            </div>
          )}
          <div
            className={cn({
              [styles['bus-type__chip']]: true,
              [styles[`bus-type__chip--${busType}`]]: true,
            })}
          >
            {SHORT_BUS_TYPE_MAP[busType]}
          </div>
          {busType === 'city' && (
            <span className={styles['bus-type__bus-number']}>
              {`${busName}번`}
            </span>
          )}
        </div>
        <div className={styles['depart-time']}>
          {`${Number(departTime.slice(0, 2)) < 12 ? '오전' : '오후'} ${departTime.slice(0, 5)}`}
        </div>
      </div>
      <div className={styles['before-arrive']}>
        <span className={styles['before-arrive__text']}>
          {isToday(new Date(departDate)) ? formatTimeDifference(departTime, formatTimeWithSeconds(new Date())) : ''}
        </span>
      </div>
    </div>
  );
}
