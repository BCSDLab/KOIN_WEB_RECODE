import { Link } from 'react-router-dom';
import { StoreListV2 } from 'api/store/entity';
import useLogger from 'utils/hooks/analytics/useLogger';
import { getJosaPicker } from '@bcsdlab/utils';
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
  const pickTopicJosa = getJosaPicker('은');

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
              {`${pickTopicJosa(store.name)} `}
              준비중입니다.
            </div>
          )}
            <div className={styles['store-list__title']}>{store.name}</div>
            <div className={styles['store-list__content']}>
              {
                store?.review_count > 0 ? (
                  <div className={styles['store-list__review']}>
                    <Star className={styles['store-list__star']} />
                    <div className={styles['store-list__rate']}>{`${store.average_rate.toFixed(1)}`}</div>
                    <div className={styles['store-list__review--text']}>
                      &#40;&nbsp;
                      {`총 리뷰 ${store?.review_count > 10 ? '10+' : store?.review_count}개`}
                      &nbsp;&#41;
                    </div>
                  </div>
                ) : (
                  <div className={styles['store-list__empty']}>
                    <EmptyStar className={styles['store-list__star']} />
                    <div className={styles['store-list__rate']}>0.0</div>
                    <div className={styles['store-list__empty--text']}>
                      첫 번째 리뷰를 작성해보세요 :&#41;
                    </div>
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
