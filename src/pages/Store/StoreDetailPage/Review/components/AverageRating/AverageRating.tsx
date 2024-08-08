import { useParams } from 'react-router-dom';
import { useGetReview } from 'pages/Store/StoreDetailPage/hooks/useGetReview';
import Rating from 'pages/Store/StoreDetailPage/Review/components/Rating/Rating';
import StarList from 'pages/Store/StoreDetailPage/Review/components/StarList/StarList';
import styles from './AverageRating.module.scss';

export default function AverageRating() {
  const params = useParams();
  const { data } = useGetReview(Number(params.id), 'LATEST');
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
            rate={(ratingObject.ratings[rate] / totalReviewCount) * 100}
            key={rate}
          />
        ))}
      </div>
    </div>
  );
}
