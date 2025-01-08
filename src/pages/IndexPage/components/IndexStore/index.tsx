import { useNavigate, Link } from 'react-router-dom';
// import useMediaQuery from 'utils/hooks/useMediaQuery';
import { useStoreCategories } from 'pages/Store/StorePage/hooks/useCategoryList';
import useLogger from 'utils/hooks/analytics/useLogger';
import ROUTES from 'static/routes';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import BenefitIcon from 'assets/svg/benefit-icon.svg';
import styles from './IndexStore.module.scss';

interface Category {
  id: number;
  name: string;
  image_url: string;
}

function IndexStore() {
  const isMobile = useMediaQuery();
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
    navigate(`${ROUTES.Store()}?category=${category.id}&COUNT=1`);
  };
  const handleStoreClick = () => {
    logger.actionEventClick({
      actionTitle: 'BUSINESS',
      title: 'main_shop_benefit',
      value: '전화주문혜택',
      event_category: 'click',
      previous_page: '메인',
      current_page: 'benefit',
      duration_time: (new Date().getTime() - Number(sessionStorage.getItem('enterMain'))) / 1000,
    });
    navigate('/benefitstore?category=1');
  };
  return (
    <section className={styles.template}>
      <Link to={ROUTES.Store()} className={styles.template__title}>
        주변상점
      </Link>
      <div className={styles.category__wrapper}>
        {isMobile
          ? categories?.shop_categories.slice(0, 12).map((category) =>
              category.name === '전체보기' ? (
                <div
                  className={styles.category__benefit}
                  onClick={() => handleStoreClick()}
                  aria-hidden
                >
                  <BenefitIcon />
                  혜택
                </div>
              ) : (
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
              )
            )
          : categories?.shop_categories.slice(0, 12).map((category) =>
              category.name === '전체보기' ? (
                <div
                  className={styles.category__benefit}
                  onClick={() => handleStoreClick()}
                  aria-hidden
                >
                  <img
                    src="https://static.koreatech.in/assets/img/icon/call_icon_2.png"
                    alt={category.name}
                    className={styles.category__image}
                  />
                  전화 주문 혜택
                </div>
              ) : (
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
              )
            )}
      </div>
    </section>
  );
}

export default IndexStore;
