import { Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import AverageRating from './components/AverageRating/AverageRating';
import ReviewButton from './components/ReviewButton';
import ReviewList from './components/ReviewList/ReviewList';
import styles from './index.module.scss';

export default function ReviewPage({ id }: { id: string }) {
  const navigate = useNavigate();

  return (
    <Suspense fallback={<div />}>
      <div className={styles.container}>
        <div className={styles['button-wrapper']}>
          <ReviewButton goReviewPage={() => navigate(`/review/${id}`)} />
        </div>
        <AverageRating />
      </div>
      <div>
        <ReviewList />
      </div>
    </Suspense>
  );
}
