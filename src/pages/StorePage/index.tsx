import React from 'react';
import STORE_CATEGORY from 'static/storeCategory';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import * as api from 'api';
import cn from 'utils/ts/classnames';
import useMediaQuery from 'utils/hooks/useMediaQuery';
import styles from './StorePage.module.scss';

interface IClassStoreName {
  storeName: HTMLInputElement | null
}

const CHECK_BOX = [
  {
    id: 'delivery',
    content: '배달 가능',
  },
  {
    id: 'card',
    content: '카드결제 가능',
  },
  {
    id: 'bank',
    content: '계좌이체 가능',
  },
];

const useStore = () => {
  const { data: storeList } = useQuery(
    'storeList',
    api.store.default,
    { retry: 0 },
  );
  return storeList?.shops;
};

const getOpenCloseTime = (open_time: string | null, close_time : string | null) => {
  if (open_time === null && close_time === null) return '운영정보없음';

  return `${open_time}~${close_time}`;
};

function StorePage() {
  const storeRef = React.useRef<IClassStoreName>({
    storeName: null,
  });
  const storeList = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery();
  const onClickEvent = (data: any) => {
    navigate(location.pathname, {
      state: {
        store: data,
      },
    });
  };

  return (
    <div className={styles.list_section}>
      <div className={styles.header}>
        주변 상점
      </div>
      <div className={styles.category}>
        <div className={styles.category__header}>CATEGORY</div>
        <div className={styles.category__wrapper}>
          {STORE_CATEGORY.map((value) => (
            <button
              className={styles.category__menu}
              type="submit"
              onClick={() => onClickEvent(value.tag)}
              key={value.tag}
            >
              <img className={styles.category__image} src={value.image} alt="category_img" />
              {value.title}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.search_bar}>
        <input
          ref={(inputRef) => { storeRef.current.storeName = inputRef; }}
          className={styles.search_bar__input}
          type="text"
          name="search"
          placeholder="상점명을 입력하세요"
        />
        <img className={styles.search_bar__icon} src="https://static.koreatech.in/assets/img/search.png" alt="search_icon" />
      </div>
      <div className={styles.option}>
        <div className={styles.option__count}>
          총
          <b> 여러 개의 업체가</b>
          있습니다.
        </div>
        <div className={styles.option__checkbox}>
          {
            CHECK_BOX.map((item) => (
              <div key={item.id} className={styles['option-checkbox']}>
                <label htmlFor={item.id} className={styles['option-checkbox__label']}>
                  <input id={item.id} type="checkbox" className={styles['option-checkbox__input']} />
                  {item.content}
                </label>
              </div>
            ))
          }
        </div>
      </div>
      <div className={styles['store-list']}>
        {
          storeList?.map((store) => (
            <div className={styles['store-list__item']} key={store.id}>
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
                <div className={cn({
                  [styles['store-item__option']]: true,
                  [styles['store-item__option--disabled']]: !store.delivery,
                })}
                >
                  {!isMobile ? '#배달가능' : '배달'}
                </div>
                <div className={cn({
                  [styles['store-item__option']]: true,
                  [styles['store-item__option--disabled']]: !store.pay_card,
                })}
                >
                  {!isMobile ? '#카드가능' : '카드'}
                </div>
                <div className={cn({
                  [styles['store-item__option']]: true,
                  [styles['store-item__option--disabled']]: !store.pay_bank,
                })}
                >
                  {!isMobile ? '#계좌이체가능' : '계좌이체'}
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}

export default StorePage;
