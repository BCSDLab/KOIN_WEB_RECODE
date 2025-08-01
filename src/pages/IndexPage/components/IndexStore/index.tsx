import { useNavigate, Link } from 'react-router-dom';
import { useStoreCategories } from 'pages/Store/StorePage/hooks/useCategoryList';
import useLogger from 'utils/hooks/analytics/useLogger';
import ROUTES from 'static/routes';
import { Suspense, useEffect } from 'react';
import { getMainDurationTime, initializeMainEntryTime } from 'pages/Store/utils/durationTime';
import styles from './IndexStore.module.scss';

interface Category {
  id: number;
  name: string;
  image_url: string;
}

interface CategoryWithEvent extends Category {
  event: {
    team: string;
    event_label: string;
    value: string;
    event_category: string;
    previous_page: string;
    current_page: string;
  };
  route: string;
}

export default function IndexStore() {
  const { data: categories } = useStoreCategories();
  const logger = useLogger();
  const navigate = useNavigate();

  const categoriesWithEvent = categories.shop_categories.map((category: Category) => ({
    ...category,
    event: {
      team: 'BUSINESS',
      event_label: 'main_shop_categories',
      value: category.name,
      event_category: 'click',
      previous_page: '메인',
      current_page: category.name,
    },
    route: `${ROUTES.Store()}?category=${category.id}`,
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

  const handleCategoryClick = ({ event, route }: CategoryWithEvent) => {
    logger.actionEventClick({
      ...event,
      duration_time: getMainDurationTime(),
    });
    navigate(route);
  };

  useEffect(() => {
    initializeMainEntryTime();
  }, []);

  return (
    <section className={styles.template}>
      <Link to={`${ROUTES.Store()}?category=1`} className={styles.template__title}>주변 상점</Link>
      <Suspense fallback={null}>
        <div className={styles.category__wrapper}>
          {categoriesWithBenefit.map((category) => (
            <button
              key={category.id}
              className={styles.category__item}
              onClick={() => handleCategoryClick(category)}
              type="button"
            >
              <img
                src={category.image_url}
                alt={category.name}
                className={styles.category__image}
              />
              {category.name}
            </button>
          ))}
        </div>
      </Suspense>
    </section>
  );
}
