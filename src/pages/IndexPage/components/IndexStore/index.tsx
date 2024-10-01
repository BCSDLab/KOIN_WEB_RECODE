import { useNavigate, Link } from 'react-router-dom';
// import useMediaQuery from 'utils/hooks/useMediaQuery';
import { useStoreCategories } from 'pages/Store/StorePage/hooks/useCategoryList';
import useLogger from 'utils/hooks/analytics/useLogger';
import ROUTES from 'static/routes';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import { useABTestView } from 'utils/hooks/abTest/useABTestView';
import useTokenState from 'utils/hooks/state/useTokenState';
import styles from './IndexStore.module.scss';

interface Category {
  id: number;
  name: string;
  image_url: string;
}

function IndexStore() {
  const isMobile = useMediaQuery();
  const token = useTokenState();
  const { data: categories } = useStoreCategories();
  const logger = useLogger();
  const navigate = useNavigate();
  const ABView = useABTestView('benefitPage', token);
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
    navigate(`${ROUTES.Store()}?category=${category.id}`);
  };
  const hadleStoreClick = () => {
    logger.actionEventClick({
      actionTitle: 'BUSINESS',
      title: 'main_shop_benefit',
      value: '전화주문혜택',
      event_category: 'click',
      previous_page: '메인',
      current_page: 'benefit',
      duration_time: (new Date().getTime() - Number(sessionStorage.getItem('enterMain'))) / 1000,
    });
    navigate('/storebenefit?category=1');
  };
  return (
    <section className={styles.template}>
      <Link to={ROUTES.Store()} className={styles.template__title}>주변상점</Link>
      <div className={styles.category__wrapper}>
        {isMobile && ABView === 'B'
          ? (
            <div className={styles['store-branch-container']}>
              <button
                type="button"
                className={styles['store-branch-button']}
                onClick={() => navigate(`${ROUTES.Store()}?category=1`)}
              >
                <img className={styles['store-branch-button__icon']} src="https://team-kap-koin-storage.s3.ap-northeast-2.amazonaws.com/assets/img/icon/shop_icon.png" alt="이미지 오류" />
                상점 목록
              </button>
              <button
                type="button"
                className={styles['store-branch-button']}
                onClick={() => navigate(`${ROUTES.StoreBenefit()}`)}
              >
                <img className={styles['store-branch-button__icon']} src="https://team-kap-koin-storage.s3.ap-northeast-2.amazonaws.com/assets/img/icon/call_icon.png" alt="이미지 오류" />
                전화 주문 혜택
              </button>
            </div>
          )
          : categories?.shop_categories.map((category) => (
            category.name === '전체보기' && ABView === 'B' ? (
              <div
                className={styles.category__benefit}
                onClick={() => hadleStoreClick()}
                aria-hidden
              >
                <img
                  src="https://team-kap-koin-storage.s3.ap-northeast-2.amazonaws.com/assets/img/icon/call_icon.png"
                  alt={category.name}
                  className={styles.category__image}
                />
                전화 주문 혜택
              </div>
            )
              : (
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
          ))}
      </div>
    </section>
  );
}

export default IndexStore;
