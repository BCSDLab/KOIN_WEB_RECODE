import { Link } from 'react-router-dom';
import useMediaQuery from 'utils/hooks/useMediaQuery';
import { useStoreCategories } from 'pages/Store/StorePage/hooks/useCategoryList';
import useLogger from 'utils/hooks/useLogger';
import styles from './IndexStore.module.scss';

function IndexStore() {
  const isMobile = useMediaQuery();
  const { data: categories } = useStoreCategories();
  const logger = useLogger();
  return (
    <section className={styles.template}>
      <Link to="/store" className={styles.template__title}>주변상점</Link>
      <div className={styles.category__wrapper}>
        {categories?.shop_categories.slice(0, 9).map((category) => (
          <Link to={`/store?category=${category.id}`} key={category.id} className={styles.category__item}>
            <img
              src={category.image_url}
              alt={category.name}
              className={styles.category__image}
              onClick={() => logger.click({
                title: 'main_store_categories',
                value: category.name,
              })}
              aria-hidden
            />
            {isMobile ? category.name.slice(0, 4) : category.name}
          </Link>
        ))}
      </div>
    </section>
  );
}

export default IndexStore;
