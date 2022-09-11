import STORE_CATEGORY from 'static/storeCategory';
import styles from './StorePage.module.scss';

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

function StorePage() {
  return (
    <div className={styles.list_section}>
      <div className={styles.header}>
        주변 상점
      </div>
      <div className={styles.category}>
        <div className={styles.category__header}>CATEGORY</div>
        <div className={styles.category__wrapper}>
          {STORE_CATEGORY.map((value) => (
            <div className={styles.category__menu} key={value.tag}>
              <img className={styles.category__image} src={value.image} alt="category_img" />
              {value.title}
            </div>
          ))}
        </div>
      </div>
      <div className={styles.search_bar}>
        <input className={styles.search_bar__input} type="text" name="search" placeholder="상점명을 입력하세요" />
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
