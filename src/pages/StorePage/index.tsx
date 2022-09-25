import React from 'react';
import STORE_CATEGORY from 'static/storeCategory';
import { useQuery } from 'react-query';
import * as api from 'api';
import cn from 'utils/ts/classnames';
import useMediaQuery from 'utils/hooks/useMediaQuery';
import useParamsHandler from './hooks/useParamsHandler';
import styles from './StorePage.module.scss';

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

const checkedFilter = (checked : string | undefined) => {
  if (checked === undefined) {
    return false;
  }
  return true;
};

const checkedState = (params: any) => {
  if (params.delivery === undefined
    && params.bank === undefined
    && params.card === undefined) {
    return true;
  }
  return false;
};

const useStore = (params: any) => {
  const { data: storeList } = useQuery(
    'storeList',
    api.store.default,
    { retry: 0 },
  );
  return storeList?.shops.filter(
    (store) => ((params.category === undefined || params.category === 'ALL') || store.category === params.category)
    && (checkedState(params) ? true : ((store.pay_bank && checkedFilter(params.bank))
      || (store.pay_card && checkedFilter(params.card))
      || (store.delivery && checkedFilter(params.delivery))))
    && store.name.includes(params.storeName ? params.storeName : ''),
  );
};

const getOpenCloseTime = (open_time: string | null, close_time : string | null) => {
  if (open_time === null && close_time === null) return '운영정보없음';

  return `${open_time}~${close_time}`;
};

const isStoreOpen = (open_time: string | null, close_time : string | null) => {
  if (open_time === null || close_time === null) return false;

  const date = new Date();
  const openTimeNum = Number(open_time.replace(':', ''));
  const closeTimeNum = Number(close_time.replace(':', ''));
  const nowTimeNum = date.getHours() * 100 + date.getMinutes();

  if (openTimeNum > closeTimeNum ? openTimeNum >= nowTimeNum || closeTimeNum >= nowTimeNum
    : openTimeNum >= nowTimeNum || closeTimeNum <= nowTimeNum) return true;
  return false;
};

function StorePage() {
  const storeRef = React.useRef<HTMLInputElement | null>(null);
  const { params, searchParams, setParams } = useParamsHandler();
  const storeList = useStore(params);
  const isMobile = useMediaQuery();

  return (
    <div className={styles.section}>
      <div className={styles.header}>
        주변 상점
      </div>
      <div className={styles.category}>
        <div className={styles.category__header}>CATEGORY</div>
        <div className={styles.category__wrapper}>
          {STORE_CATEGORY.map((value) => (
            <button
              className={cn({
                [styles.category__menu]: true,
                [styles['category__menu--check']]: value.tag === searchParams.get('category'),
              })}
              type="button"
              onClick={() => setParams('category', value.tag, false)}
              key={value.tag}
            >
              <img className={styles.category__image} src={value.image} alt="category_img" />
              <span>{value.title}</span>
            </button>
          ))}
        </div>
      </div>
      <div className={styles.search_bar}>
        <input
          ref={storeRef}
          className={styles.search_bar__input}
          defaultValue={searchParams.get('storeName') === undefined ? '' : searchParams.get('storeName') ?? ''}
          type="text"
          name="search"
          placeholder="상점명을 입력하세요"
          onKeyPress={(e) => {
            if (e.key === 'Enter') setParams('storeName', e.target.value, (searchParams.get('storeName') === undefined));
          }}
        />
        <button
          className={styles.search_bar__icon}
          type="button"
          onClick={() => { setParams('storeName', storeRef.current?.value ?? '', (searchParams.get('storeName') === undefined)); }}
        >
          <img className={styles['search-icon']} src="https://static.koreatech.in/assets/img/search.png" alt="store_icon" />
        </button>
      </div>
      <div className={styles.option}>
        <div className={styles.option__count}>
          총
          <b>
            {storeList?.length}
            개의 업체가
          </b>
          있습니다.
        </div>
        <div className={styles.option__checkbox}>
          {
            CHECK_BOX.map((item) => (
              <div key={item.id} className={styles['option-checkbox']}>
                <label htmlFor={item.id} className={styles['option-checkbox__label']}>
                  <input
                    id={item.id}
                    type="checkbox"
                    defaultChecked={searchParams.get(item.id) ? true : undefined}
                    className={styles['option-checkbox__input']}
                    onChange={() => setParams(item.id, item.value, true)}
                  />
                  {item.content}
                </label>
              </div>
            ))
          }
        </div>
      </div>
      {isMobile && <div className={styles['store-mobile-header']}>상점목록</div>}
      <div className={styles['store-list']}>
        {
          storeList?.map((store) => (
            <div className={styles['store-list__item']} key={store.id}>
              {isStoreOpen(store.open_time, store.close_time) && <div className={styles['store-none-open']} />}
              <div className={styles['store-list__title']}>{store.name}</div>
              <div className={styles['store-list__phone']}>
                전화번호
                <span>{store.phone}</span>
              </div>
              <div className={styles['store-list__open-time']}>
                운영시간
                <span>{getOpenCloseTime(store.open_time, store.close_time)}</span>
              </div>
              <div className={styles['store-item']}>
                {(store.delivery || isMobile)
                && <div className={styles['store-item__option']} aria-hidden={!store.delivery}>{!isMobile ? '#배달가능' : '배달'}</div>}
                {(store.pay_card || isMobile)
                && <div className={styles['store-item__option']} aria-hidden={!store.pay_card}>{!isMobile ? '#카드가능' : '카드'}</div>}
                {(store.pay_bank || isMobile)
                && <div className={styles['store-item__option']} aria-hidden={!store.pay_bank}>{!isMobile ? '#계좌이체가능' : '계좌이체'}</div>}
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}

export default StorePage;
