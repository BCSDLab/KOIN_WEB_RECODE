import StoreReviewsPage from 'components/Store/mobile/StoreReviewsPage';

import styles from './OrderShopReviewsPage.module.scss';

interface OrderShopReviewsPageProps {
  shopId: string;
}

// 주문 상점 리뷰 본문. 상점 리뷰 화면 본문을 재사용하고 헤더 높이(60px)에 맞춰 화면 높이만 보정한다
export default function OrderShopReviewsPage({ shopId }: OrderShopReviewsPageProps) {
  return (
    <div className={styles.container}>
      <StoreReviewsPage id={shopId} />
    </div>
  );
}
