import { useRouter } from 'next/router';

import StarIcon from 'assets/svg/store/star-icon.svg';
import { getLoggingTime } from 'components/Store/mobile/common/utils/loggingTime';
import { getCategoryIdFromQuery, getCategoryNameById } from 'components/Store/mobile/common/utils/shopCategories';
import ROUTES from 'static/routes';
import useLogger from 'utils/hooks/analytics/useLogger';
import { isomorphicSessionStorage } from 'utils/ts/env';

import styles from './ShopCard.module.scss';

// KOIN_ORDER_WEBVIEW pages/Home/components/ShopCard 이전. 상점 목록·검색 결과의 가로형 카드
interface ShopCardProps {
  shopId: number;
  isOpen: boolean;
  name: string;
  rating: number;
  reviewCount: number;
  thumbnailUrl: string;
  isOrderable: boolean;
}

export default function ShopCard({ shopId, isOpen, name, rating, reviewCount, thumbnailUrl, isOrderable }: ShopCardProps) {
  const router = useRouter();
  const logger = useLogger();

  const handleShopCardClick = () => {
    const categoryName = getCategoryNameById(getCategoryIdFromQuery(router.query.category));
    logger.actionEventClick({
      team: 'BUSINESS',
      event_label: 'shop_click',
      value: `${name}`,
      duration_time: getLoggingTime('selectedCategoryTime'),
      previous_page: categoryName,
      current_page: `${name}`,
    });
    isomorphicSessionStorage.setItem('currentCategory', categoryName);
    router.push(isOrderable ? ROUTES.OrderShop({ id: String(shopId) }) : ROUTES.StoreDetail({ id: String(shopId) }));
  };

  return (
    <button type="button" onClick={handleShopCardClick} data-testid={`shopCard-${shopId}`} className={styles.card}>
      {!isOpen && (
        <div className={styles.card__closed}>
          <div className={styles['card__closed-text']}>영업이 종료된 가게에요!</div>
        </div>
      )}

      {thumbnailUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- 오라클과 같은 원본 이미지 주소를 그대로 쓴다(next/image 최적화 경로를 거치지 않음)
        <img src={thumbnailUrl} alt={name} className={styles.card__thumbnail} />
      ) : (
        <div className={styles.card__placeholder}>이미지 준비중</div>
      )}

      <div className={styles.card__info}>
        <div className={styles.card__name} data-testid={`shopName-${shopId}`}>
          {name}
        </div>

        <div className={styles.card__rating}>
          <div className={styles['card__rating-score']}>
            <StarIcon fill="#ffc62b" className={styles.card__star} />
            <div>{rating}</div>
          </div>
          <div className={styles['card__review-count']} data-testid={`reviewCount-${shopId}`}>
            ( 리뷰 {reviewCount}개 )
          </div>
        </div>

        <div className={styles.card__tags} />
      </div>
    </button>
  );
}
