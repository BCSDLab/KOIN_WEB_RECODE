import { Link } from 'react-router-dom';
import { StoreListV2 } from 'api/store/entity';
import useLogger from 'utils/hooks/useLogger';
import { ReactComponent as EventIcon } from 'assets/svg/event.svg';
import { ReactComponent as Star } from 'assets/svg/Review/star.svg';
import { ReactComponent as EmptyStar } from 'assets/svg/Review/empty-star.svg';
import styles from './MobileStoreList.module.scss';

interface MobileStoreListProps {
  storeListData: StoreListV2[] | undefined;
}

export default function MobileStoreList(mobileStoreListProps: MobileStoreListProps) {
  const { storeListData } = mobileStoreListProps;
  const logger = useLogger();
  // eslint-disable-next-line
  const Josa = require('josa-js');

  return (
    <div className={styles['store-list']}>
      {
        storeListData?.map((store: StoreListV2) => (
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
            <div className={styles['store-list__cotent']}>
              {
                store?.review_count > 0 ? (
                  <div className={styles['store-list__star']}>
                    <Star />
                    {`${store.average_rate.toFixed(1)}`}
                    <span className={styles['store-list__star--text']}>
                      &#40;&nbsp;
                      {`총 리뷰 ${store?.review_count > 10 ? '10+' : store?.review_count}개`}
                      &nbsp;&#41;
                    </span>
                  </div>
                ) : (
                  <div className={styles['store-list__empty-star']}>
                    <EmptyStar />
                    0.0
                    <span className={styles['store-list__empty-star--text']}>
                      첫 번째 리뷰를 작성해보세요 :&#41;
                    </span>
                  </div>
                )
              }

            </div>
          </Link>
        ))
      }
    </div>
  );
}
