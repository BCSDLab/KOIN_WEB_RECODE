import { useNavigate, Link } from 'react-router-dom';
// import useMediaQuery from 'utils/hooks/useMediaQuery';
import { useStoreCategories } from 'pages/Store/StorePage/hooks/useCategoryList';
import useLogger from 'utils/hooks/analytics/useLogger';
import ROUTES from 'static/routes';
import styles from './IndexStore.module.scss';

interface Category {
  id: number;
  name: string;
  image_url: string;
}

function IndexStore() {
  // const isMobile = useMediaQuery();
  const { data: categories } = useStoreCategories();
  const logger = useLogger();
  const navigate = useNavigate();

  const handleStoreCategoryClick = (e: React.MouseEvent<HTMLDivElement>, category: Category) => {
    e.preventDefault();
    logger.actionEventClick({
      actionTitle: 'BUSINESS',
      title: 'main_shop_categories',
      value: category.name,
      event_category: 'click',
      previous_page: '메인',
      current_page: category.name,
      duration_time: (new Date().getTime() - Number(sessionStorage.getItem('enterMain'))) / 1000,
    });
    navigate(`${ROUTES.Store}?category=${category.id}`);
  };

  return (
    <section className={styles.template}>
      <Link to={ROUTES.Store} className={styles.template__title}>주변상점</Link>
      <div className={styles.category__wrapper}>
        {categories?.shop_categories.map((category) => (
          <div
            key={category.id}
            className={styles.category__item}
            onClick={(e) => handleStoreCategoryClick(e, category)}
            aria-hidden
          >
            <img
              src={category.image_url}
              alt={category.name}
              className={styles.category__image}
            />
            {category.name}
          </div>
        ))}
      </div>
    </section>
  );
}

export default IndexStore;
