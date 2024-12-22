import { BusTypeResponse } from 'api/bus/entity';
import BusIcon from 'assets/svg/Bus/bus-icon.svg';
import { SHORT_BUS_TYPE_MAP } from 'pages/BusRoutePage/ts/busModules';
import { cn } from '@bcsdlab/utils';
import styles from './BusRoute.module.scss';

interface BusRouteProps {
  busType: BusTypeResponse,
  busName: string,
  departTime: string, // 'HH:mm:ss'
}

export default function BusRoute({
  busType, busName, departTime,
}: BusRouteProps) {
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
          {`${Number(departTime.slice(0, 2)) > 12 ? '오전' : '오후'} ${departTime}`}
        </div>
      </div>
      <div className={styles['before-arrive']}>
        {busType === 'city' && (
          <span className={styles['before-arrive__route-name']}>
            {busName}
          </span>
        )}
        <span className={styles['arrive-time__text']}>
          몇 분 전
        </span>
      </div>
    </div>
  );
}
