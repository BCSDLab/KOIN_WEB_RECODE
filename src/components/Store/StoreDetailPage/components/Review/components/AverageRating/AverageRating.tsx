import { useQueryClient, useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { storeQueries, storeQueryKeys } from 'api/store/queries';
import Rating from 'components/Store/StoreDetailPage/components/Review/components/Rating/Rating';
import StarList from 'components/Store/StoreDetailPage/components/Review/components/StarList/StarList';
import useTokenState from 'utils/hooks/state/useTokenState';
import type { InfiniteData } from '@tanstack/react-query';
import type { ReviewListResponse } from 'api/store/entity';
import styles from './AverageRating.module.scss';

export default function AverageRating({ id }: { id: string }) {
  const token = useTokenState();
  const queryClient = useQueryClient();
  const publicReviewFeedKey = storeQueryKeys.reviewFeed(Number(id), 'LATEST', 'public');
  const publicInitialData = token
    ? queryClient.getQueryData<InfiniteData<ReviewListResponse, number>>(publicReviewFeedKey)
    : undefined;

  const { data } = useSuspenseInfiniteQuery({
    ...storeQueries.reviewFeed({ shopId: Number(id), sorter: 'LATEST', token }),
    initialData: publicInitialData,
    initialDataUpdatedAt: publicInitialData ? 0 : undefined,
  });
  const totalReviewCount = data.pages[0].total_count;

  const ratingObject = data.pages[0].statistics;

  const rateList: ['5', '4', '3', '2', '1'] = ['5', '4', '3', '2', '1'];

  return (
    <div className={styles.container}>
      <div className={styles.point}>
        <div className={styles.point__rating}>{ratingObject.average_rating.toFixed(1)}</div>
        <div>
          <StarList average_rating={ratingObject.average_rating} />
        </div>
      </div>
      <div className={styles.rating}>
        {rateList.map((rate) => (
          <Rating
            point={rate}
            count={ratingObject.ratings[rate]}
            rate={totalReviewCount ? (ratingObject.ratings[rate] / totalReviewCount) * 100 : 0}
            key={rate}
          />
        ))}
      </div>
    </div>
  );
}
