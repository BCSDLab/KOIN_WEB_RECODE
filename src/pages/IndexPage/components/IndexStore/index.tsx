import STORE_CATEGORY from 'static/storeCategory';
import { Link } from 'react-router-dom';
import styles from './IndexStore.module.scss';

function IndexStore() {
  return (
    <section className={styles.template}>
      <Link to="/store" className={styles.template__title}>주변상점</Link>
      <div className={styles.category__wrapper}>
        {STORE_CATEGORY.map((category) => (
          <Link to={`/store?category=${category.tag}`} key={category.title} className={styles.category__item}>
            <img src={category.image} alt={category.title} className={styles.category__image} />
            {category.title}
          </Link>
        ))}
      </div>
    </section>
  );
}

export default IndexStore;
