import { Link } from 'react-router-dom';
import { StoreList } from 'api/store/entity';
import { ReactComponent as EventIcon } from 'assets/svg/event.svg';
import getDayOfWeek from 'utils/ts/getDayOfWeek';
import useLogger from 'utils/hooks/analytics/useLogger';
import styles from './DesktopStoreList.module.scss';

interface StoreListProps {
  storeListData: StoreList[] | undefined;
}

export const getOpenCloseTime = (open_time: string | null, close_time: string | null) => {
  if (open_time === null && close_time === null) return '운영정보없음';
  if (open_time === '00:00' && close_time === '00:00') return '24시간 운영';
  return `${open_time}~${close_time}`;
};

export default function DesktopStoreList(storeListProps: StoreListProps) {
  const { storeListData } = storeListProps;
  const logger = useLogger();

  // eslint-disable-next-line
  const Josa = require('josa-js');

  return (
    <div className={styles['store-list']}>
      {storeListData?.map((store: StoreList) => (
        <Link
          to={`/store/${store.id}`}
          className={styles['store-list__item']}
          key={store.id}
          onClick={() => logger.actionEventClick({ actionTitle: 'BUSINESS', title: 'shop_click', value: store.name })}
        >
          {store.is_event
          && store.is_open
          && (
            <div className={styles['store-list__item--event']}>
              이벤트
              <EventIcon />
            </div>
          )}
          {!store.is_open
          && (
            <div className={styles['store-none-open']}>
              <span className={styles['store-none-open__name']}>{store.name}</span>
              {`${Josa.c(store.name, '은/는')} `}
              준비중입니다.
            </div>
          )}
          <div className={styles['store-list__title']}>{store.name}</div>
          <div className={styles['store-list__phone']}>
            전화번호
            <span>{store.phone}</span>
          </div>
          <div className={styles['store-list__open-time']}>
            운영시간
            <span>
              {store.open[getDayOfWeek()] && getOpenCloseTime(
                store.open[getDayOfWeek()].open_time,
                store.open[getDayOfWeek()].close_time,
              )}
            </span>
          </div>
          <div className={styles['store-item']}>
            {(store.delivery) && (
            <div className={styles['store-item__option']} aria-hidden={!store.delivery}>
              배달
            </div>
            )}
            {(store.pay_card) && (
            <div className={styles['store-item__option']} aria-hidden={!store.pay_card}>
              카드
            </div>
            )}
            {(store.pay_bank) && (
            <div className={styles['store-item__option']} aria-hidden={!store.pay_bank}>
              계좌이체
            </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
