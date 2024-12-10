import BusIcon from 'assets/svg/Bus/bus-icon.svg';
import { useState } from 'react';
import { BusType, getShortBusType } from 'pages/BusPage/ts/busModules';
import { cn } from '@bcsdlab/utils';
import styles from './BusRoute.module.scss';

interface BusRouteProps {
  busType: BusType,
  routeName: string,
  departTime: string,
}

export default function BusRoute({
  busType, routeName, departTime,
}: BusRouteProps) {
  const [period, setPeriod] = useState('오전');
  const busTypeName = getShortBusType(busType);
  console.log(routeName);

  if (Number(departTime.slice(0, 2)) > 12) setPeriod('오후');

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
            {busTypeName}
          </div>
        </div>
        <div className={styles['depart-time']}>
          {`${period} ${departTime}`}
        </div>
      </div>
      <div>
        몇 분 전
      </div>
    </div>
  );
}
