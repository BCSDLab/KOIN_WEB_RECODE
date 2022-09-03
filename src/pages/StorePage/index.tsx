import STORE_CATEGORY from 'static/storeCategory';
import styles from './StorePage.module.scss';

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
    </div>
  );
}

export default StorePage;
