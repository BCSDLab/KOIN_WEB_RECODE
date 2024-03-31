import React from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import getDayOfWeek from 'utils/ts/getDayOfWeek';
import * as api from 'api';
import cn from 'utils/ts/classnames';
import useMediaQuery from 'utils/hooks/useMediaQuery';
import useLogger from 'utils/hooks/useLogger';
import useParamsHandler from 'utils/hooks/useParamsHandler';
import useScrollToTop from 'utils/hooks/useScrollToTop';
import styles from './StorePage.module.scss';
import { useStoreCategories } from './hooks/useCategoryList';

type StoreSearchQueryType = {
  storeName?: string;
  category?: string;
  delivery?: string;
  bank?: string;
  card?: string;
};

const CHECK_BOX = [
  {
    id: 'delivery',
    content: '배달 가능',
    value: '1',
  },
  {
    id: 'card',
    content: '카드결제 가능',
    value: '1',
  },
  {
    id: 'bank',
    content: '계좌이체 가능',
    value: '1',
  },
];

const searchStorePayCheckBoxFilter = (checked: string | undefined) => {
  if (checked === undefined) {
    return false;
  }
  return true;
};

const useStoreList = (params: StoreSearchQueryType) => {
  const { data: storeList } = useQuery('storeList', api.store.getStoreList, {
    retry: 0,
  });
  const selectedCategory = Number(params.category);

  return storeList?.shops.filter((store) => {
    const matchCategory = params.category === undefined || (
      store.category_ids.some((id) => id === selectedCategory)
    );
    const matchConditions = [];

    if (params.delivery !== undefined) {
      matchConditions.push(store.delivery === searchStorePayCheckBoxFilter(params.delivery));
    }
    if (params.bank !== undefined) {
      matchConditions.push(store.pay_bank === searchStorePayCheckBoxFilter(params.bank));
    }
    if (params.card !== undefined) {
      matchConditions.push(store.pay_card === searchStorePayCheckBoxFilter(params.card));
    }

    const isMatchAllSelectedConditions = matchConditions.every((condition) => condition === true);

    return matchCategory && (matchConditions.length === 0 || isMatchAllSelectedConditions) && store.name.includes(params.storeName ? params.storeName : '');
  });
};

const getOpenCloseTime = (open_time: string | null, close_time: string | null) => {
  if (open_time === null && close_time === null) return '운영정보없음';
  if (open_time === '00:00' && close_time === '00:00') return '24시간 운영';

  return `${open_time}~${close_time}`;
};

const isStoreOpen = (open_time: string | null, close_time: string | null) => {
  if (open_time === null || close_time === null) return false;
  if (open_time === '00:00' && close_time === '00:00') return false;

  const date = new Date();
  const openTimeNum = Number(open_time.replace(':', ''));
  const closeTimeNum = Number(close_time.replace(':', ''));
  const nowTimeNum = date.getHours() * 100 + date.getMinutes();

  if (openTimeNum > closeTimeNum ? (
    nowTimeNum >= openTimeNum || nowTimeNum < closeTimeNum
  ) : (
    nowTimeNum >= openTimeNum && nowTimeNum < closeTimeNum
  )) return false;

  return true;
};

function StorePage() {
  const storeRef = React.useRef<HTMLInputElement | null>(null);
  const { params, searchParams, setParams } = useParamsHandler();
  const storeList = useStoreList(params);
  const isMobile = useMediaQuery();
  const { data: categories } = useStoreCategories();
  const logger = useLogger();
  const selectedCategory = Number(searchParams.get('category'));
  useScrollToTop();

  return (
    <div className={styles.section}>
      <div className={styles.header}>주변 상점</div>
      <div className={styles.category}>
        <div className={styles.category__header}>CATEGORY</div>
        <div className={styles.category__wrapper}>
          {categories?.shop_categories.slice(0, 9).map((category) => (
            <button
              className={cn({
                [styles.category__menu]: true,
                [styles['category__menu--selected']]: category.id === selectedCategory,
              })}
              role="radio"
              aria-checked={category.id === selectedCategory}
              type="button"
              onClick={() => setParams('category', `${category.id}`, { deleteBeforeParam: false, replacePage: true })}
              key={category.id}
            >
              <img className={styles.category__image} src={category.image_url} alt="category_img" />
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>
      <div className={styles.search_bar}>
        <input
          ref={storeRef}
          className={styles.search_bar__input}
          defaultValue={
            searchParams.get('storeName') === undefined ? '' : searchParams.get('storeName') ?? ''
          }
          type="text"
          name="search"
          placeholder="상점명을 입력하세요"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setParams('storeName', e.currentTarget.value, {
                deleteBeforeParam: searchParams.get('storeName') === undefined,
                replacePage: true,
              });
            }
          }}
        />
        <button
          className={styles.search_bar__icon}
          type="button"
          onClick={() => {
            setParams('storeName', storeRef.current?.value ?? '', {
              deleteBeforeParam: searchParams.get('storeName') === undefined,
              replacePage: true,
            });
          }}
        >
          <img
            className={styles['search-icon']}
            src="https://static.koreatech.in/assets/img/search.png"
            alt="store_icon"
          />
        </button>
      </div>
      <div className={styles.option}>
        <div className={styles.option__count}>
          총
          <strong>
            {storeList?.length}
            개의 업체가
          </strong>
          있습니다.
        </div>
        <div className={styles.option__checkbox}>
          {CHECK_BOX.map((item) => (
            <div key={item.id} className={styles['option-checkbox']}>
              <label htmlFor={item.id} className={styles['option-checkbox__label']}>
                <input
                  id={item.id}
                  type="checkbox"
                  checked={searchParams.get(item.id) ? true : undefined}
                  className={styles['option-checkbox__input']}
                  onChange={() => {
                    setParams(item.id, item.value, {
                      deleteBeforeParam: true,
                      replacePage: true,
                    });
                  }}
                />
                {item.content}
              </label>
            </div>
          ))}
        </div>
      </div>
      {isMobile && <div className={styles['store-mobile-header']}>상점목록</div>}
      <div className={styles['store-list']}>
        {storeList?.map((store) => (
          <Link
            to={`/store/${store.id}`}
            className={styles['store-list__item']}
            key={store.id}
            onClick={() => logger.click({ title: 'store_card_click', value: store.name })}
          >
            {isStoreOpen(
              store.open[getDayOfWeek()].open_time,
              store.open[getDayOfWeek()].close_time,
            ) && <div className={styles['store-none-open']} />}
            <div className={styles['store-list__title']}>{store.name}</div>
            <div className={styles['store-list__phone']}>
              전화번호
              <span>{store.phone}</span>
            </div>
            <div className={styles['store-list__open-time']}>
              운영시간
              <span>
                {getOpenCloseTime(
                  store.open[getDayOfWeek()].open_time,
                  store.open[getDayOfWeek()].close_time,
                )}
              </span>
            </div>
            <div className={styles['store-item']}>
              {(store.delivery || isMobile) && (
                <div className={styles['store-item__option']} aria-hidden={!store.delivery}>
                  {!isMobile ? '#배달가능' : '배달'}
                </div>
              )}
              {(store.pay_card || isMobile) && (
                <div className={styles['store-item__option']} aria-hidden={!store.pay_card}>
                  {!isMobile ? '#카드가능' : '카드'}
                </div>
              )}
              {(store.pay_bank || isMobile) && (
                <div className={styles['store-item__option']} aria-hidden={!store.pay_bank}>
                  {!isMobile ? '#계좌이체가능' : '계좌이체'}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default StorePage;
