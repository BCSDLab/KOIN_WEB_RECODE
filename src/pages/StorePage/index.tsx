import React from 'react';
import STORE_CATEGORY from 'static/storeCategory';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import * as api from 'api';
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
  return storeList;
};

const useFilteredStoreList = (storeName: string) => {
  const storeList = useStore();
  storeList?.shops.filter((store: any) => store.name.includes(storeName));
};

const useParameter = (data: any) => {
  const navigate = useNavigate();
  const location = useLocation();

  navigate(location.pathname, {
    state: {
      store: data,
    },
  });

  return location;
};

function StorePage() {
  const storeRef = React.useRef<IClassStoreName>({
    storeName: null,
  });
  const storeList = useFilteredStoreList('dk');
  console.log(storeList);
  return (
    <div className={styles.list_section}>
      <div className={styles.header}>
        주변 상점
      </div>
      <div className={styles.category}>
        <div className={styles.category__header}>CATEGORY</div>
        <div className={styles.category__wrapper}>
          {STORE_CATEGORY.map((value) => (
            <div
              className={styles.category__menu}
              key={value.tag}
            >
              <img className={styles.category__image} src={value.image} alt="category_img" />
              {value.title}
            </div>
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
      <div className={styles.storelist}>
        test
      </div>
    </div>
  );
}

export default StorePage;
