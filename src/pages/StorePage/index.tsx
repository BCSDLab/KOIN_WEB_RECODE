import STORECATEGORY from 'static/storeCategory';
import styles from './StorePage.module.scss';

function StorePage() {
  return (
    <div className={styles.list_section}>
      <div className={styles.header}>
        주변상점
      </div>
      <div className={styles.category}>
        <div className={styles.category__header}>CATEGORY</div>
        <div className={styles.category__wrapper}>
          {STORECATEGORY.map((value) => (
            <div className={styles.category__menu} key={value.tag}>
              <img className={styles.category__image} src={value.image} alt="category_img" />
              {value.title}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StorePage;
