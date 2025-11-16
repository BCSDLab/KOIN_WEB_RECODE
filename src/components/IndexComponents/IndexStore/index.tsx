import { Suspense, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getMainDurationTime, initializeMainEntryTime } from 'components/Store/utils/durationTime';
import { useStoreCategories } from 'hooks/store/storePage/useCategoryList';
import ROUTES from 'static/routes';
import useLogger from 'utils/hooks/analytics/useLogger';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
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
  const router = useRouter();
  const isMobile = useMediaQuery();

  console.log('[IndexStore] isMobile:', isMobile);

  const isStage = process.env.NEXT_PUBLIC_API_PATH?.includes('stage');
  const ORDER_BASE_URL = isStage ? 'https://order.stage.koreatech.in' : 'https://order.koreatech.in';

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
    route: `${ORDER_BASE_URL}/shops/?category=${category.id}`,
  }));

  const categoriesWithBenefit: CategoryWithEvent[] = categoriesWithEvent.map((category) => {
    if (category.name === '전체보기') {
      return {
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
      };
    }

    return {
      ...category,
      route: `${ROUTES.Store()}?category=${category.id}`,
    };
  });

  const renderCategories = isMobile ? categoriesWithEvent : categoriesWithBenefit;

  const titleLink = isMobile ? `${ORDER_BASE_URL}/shops/?category=1` : `${ROUTES.Store()}?category=1`;

  const handleCategoryClick = ({ event, route }: CategoryWithEvent) => {
    logger.actionEventClick({
      ...event,
      duration_time: getMainDurationTime(),
    });
    router.push(route);
  };

  useEffect(() => {
    initializeMainEntryTime();
  }, []);

  return (
    <section className={styles.template}>
      <Link href={titleLink} className={styles.template__title}>
        주변 상점
      </Link>
      <Suspense fallback={null}>
        <div className={styles.category__wrapper}>
          {renderCategories.map((category) => (
            <button
              key={category.id}
              className={styles.category__item}
              onClick={() => handleCategoryClick(category)}
              type="button"
            >
              <img src={category.image_url} alt={category.name} className={styles.category__image} />
              {category.name}
            </button>
          ))}
        </div>
      </Suspense>
    </section>
  );
}
