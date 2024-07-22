import { useParams } from 'react-router-dom';
import { useGetReview } from 'pages/Store/StoreDetailPage/hooks/useGetReview';
import { ReactComponent as EmptyStar } from 'assets/svg/Review/empty-star.svg';
import { ReactComponent as Star } from 'assets/svg/Review/star.svg';
import Rating from 'pages/Store/StoreDetailPage/Review/components/Rating/Rating';
import styles from './AverageRating.module.scss';

export default function AverageRating() {
  const params = useParams();
  const { data } = useGetReview(Number(params.id));
  const totalReviewCount = data.pages[0].current_count;

  const ratingObject = data.pages[0].statistics;

  const emptyStarList = new Array(5 - Math.floor(ratingObject.average_rating)).fill(false);
  const starList = new Array(Math.floor(ratingObject.average_rating)).fill(true);

  const rating = [...starList, ...emptyStarList];
  const rateList: ['5', '4', '3', '2', '1'] = ['5', '4', '3', '2', '1'];

  return (
    <div className={styles.container}>
      <div className={styles.point}>
        <div className={styles.point__rating}>{ratingObject.average_rating.toFixed(1)}</div>
        <div>
          {rating.map((ratio) => (ratio ? <Star /> : <EmptyStar />))}
        </div>
      </div>
      <div className={styles.rating}>
        {rateList.map((rate) => (
          <Rating
            point={rate}
            count={ratingObject.ratings[rate]}
            rate={(ratingObject.ratings[rate] / totalReviewCount) * 100}
          />
        ))}
      </div>
    </div>
  );
}
