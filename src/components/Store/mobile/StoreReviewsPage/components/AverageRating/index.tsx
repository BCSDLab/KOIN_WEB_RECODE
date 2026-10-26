import type { UnorderableShopReviewsResponse } from 'api/storeMobile/entity';
import StarList from 'components/Store/mobile/StoreReviewsPage/components/StarList';

import styles from './AverageRating.module.scss';

// KOIN_ORDER_WEBVIEW pages/Shop/components/AverageRating·Rating 이전. 통계는 항상 최신순 목록 응답을 쓴다
interface AverageRatingProps {
  data: UnorderableShopReviewsResponse;
}

const RATE_LIST = ['5', '4', '3', '2', '1'] as const;

export default function AverageRating({ data }: AverageRatingProps) {
  const average = data.statistics.average_rating;
  const { ratings } = data.statistics;
  const totalReviewCount = data.total_count;

  return (
    <div className={styles.average}>
      <div className={styles.average__summary}>
        <div className={styles.average__score}>{average.toFixed(1)}</div>
        <div className={styles.average__stars}>
          <StarList rating={average} />
        </div>
      </div>

      <div className={styles.average__rates}>
        {RATE_LIST.map((point) => {
          const count = ratings[point];
          const fillPercent = totalReviewCount ? (count / totalReviewCount) * 100 : 0;

          return (
            <div key={point} className={styles.rate}>
              <div className={styles.rate__row}>
                <div className={styles.rate__point}>
                  {point}
                  {'점'}
                </div>
                <div className={styles.rate__track}>
                  <div className={styles.rate__fill} style={{ width: `${fillPercent}%` }} />
                </div>
                <div className={styles.rate__count}>{count}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
