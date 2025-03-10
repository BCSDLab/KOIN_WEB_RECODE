import { useNavigate, Link } from 'react-router-dom';
import { useStoreCategories } from 'pages/Store/StorePage/hooks/useCategoryList';
import useLogger from 'utils/hooks/analytics/useLogger';
import ROUTES from 'static/routes';
import { Suspense } from 'react';
import styles from './IndexStore.module.scss';

interface Category {
  id: number;
  name: string;
  image_url: string;
}

interface CategoryWithEvent extends Category {
  event: {
    actionTitle: string;
    event_label: string;
    value: string;
    event_category: string;
    previous_page: string;
    current_page: string;
    duration_time: number;
  };
  route: string;
}

function IndexStore() {
  const { data: categories } = useStoreCategories();
  const logger = useLogger();
  const navigate = useNavigate();

  const categoriesWithEvent = categories.shop_categories.map((category: Category) => ({
    ...category,
    event: {
      actionTitle: 'BUSINESS',
      event_label: 'main_shop_categories',
      value: category.name,
      event_category: 'click',
      previous_page: '메인',
      current_page: category.name,
      duration_time: (new Date().getTime() - Number(sessionStorage.getItem('enterMain'))) / 1000,
    },
    route: `${ROUTES.Store()}?category=${category.id}&COUNT=1`,
  }));

  const categoriesWithBenefit: CategoryWithEvent[] = categoriesWithEvent.map(
    (category) => (
      category.name === '전체보기' ? ({
        ...category,
        name: '혜택',
        image_url: 'https://static.koreatech.in/assets/img/icon/benefit_icon.png',
        event: {
          ...category.event,
          event_label: 'main_shop_benefit',
          value: '전화주문혜택',
          current_page: 'benefit',
        },
        route: `${ROUTES.BenefitStore()}?category=1`,
      }) : category
    ),
  );

  const handleCategoryClick = (
    e: React.MouseEvent<HTMLDivElement>,
    category: CategoryWithEvent,
  ) => {
    e.preventDefault();
    logger.actionEventClick(category.event);
    navigate(category.route);
  };

  return (
    <section className={styles.template}>
      <Link to={ROUTES.Store()} className={styles.template__title}>주변 상점</Link>
      <Suspense fallback={null}>
        <div className={styles.category__wrapper}>
          {categoriesWithBenefit.map((category) => (
            <div
              key={category.id}
              className={styles.category__item}
              onClick={(e) => handleCategoryClick(e, category)}
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
      </Suspense>
    </section>
  );
}

export default IndexStore;
