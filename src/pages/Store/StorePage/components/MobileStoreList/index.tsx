import { Link } from 'react-router-dom';
import { StoreListV2 } from 'api/store/entity';
import useLogger from 'utils/hooks/analytics/useLogger';
import { getJosaPicker } from '@bcsdlab/utils';
import EventIcon from 'assets/svg/event.svg';
import Star from 'assets/svg/Review/star.svg';
import EmptyStar from 'assets/svg/Review/empty-star.svg';
import { useStoreCategories } from 'pages/Store/StorePage/hooks/useCategoryList';
import { StorePageType } from 'static/store';
import useParamsHandler from 'utils/hooks/routing/useParamsHandler';
import ROUTES from 'static/routes';
import BenefitRotator from 'pages/Store/StorePage/components/BenefitRotator';
import { getCategoryDurationTime } from 'pages/Store/utils/durationTime';
import styles from './MobileStoreList.module.scss';

interface MobileStoreListProps {
  storeListData: StoreListV2[] | undefined;
  storeType: StorePageType;
}

export default function MobileStoreList(mobileStoreListProps: MobileStoreListProps) {
  const { storeListData, storeType } = mobileStoreListProps;
  const logger = useLogger();
  const pickTopicJosa = getJosaPicker('은');

  const { searchParams } = useParamsHandler();
  const { data: categories } = useStoreCategories();
  const selectedCategory = Number(searchParams.get('category'));
  const koreanCategory = categories?.shop_categories.find(
    (category) => category.id === selectedCategory,
  )?.name;

  return (
    <div className={styles['store-list']}>
      {
        storeListData?.map((store: StoreListV2) => (
          <Link
            to={`${ROUTES.StoreDetail({ id: String(store.id), isLink: true })}?state=메뉴&type=${storeType}`}
            className={styles['store-list__item']}
            key={store.id}
            onClick={() => logger.actionEventClick({
              team: 'BUSINESS',
              event_label: `${storeType}_click`,
              value: store.name,
              event_category: 'click',
              previous_page: `${koreanCategory || '전체보기'}`,
              current_page: `${store.name}`,
              duration_time: getCategoryDurationTime(),
            })}
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
            <div className={styles['store-list__header']}>
              <div className={styles['store-list__title']}>{store.name}</div>
              {store.benefit_details && <BenefitRotator benefits={store.benefit_details} />}
              {store.benefit_detail && <BenefitRotator benefits={store.benefit_detail} />}
            </div>
            <div className={styles['store-list__content']}>
              {
                store?.review_count > 0 ? (
                  <div className={styles['store-list__review']}>
                    <div className={styles['store-list__star']}>
                      <Star />
                    </div>
                    <div className={styles['store-list__rate']}>{`${store.average_rate.toFixed(1)}`}</div>
                    <div className={styles['store-list__review--text']}>
                      &#40;&nbsp;
                      {`총 리뷰 ${store?.review_count > 10 ? '10+' : store?.review_count}개`}
                      &nbsp;&#41;
                    </div>
                  </div>
                ) : (
                  <div className={styles['store-list__empty']}>
                    <div className={styles['store-list__star']}>
                      <EmptyStar />
                    </div>
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
