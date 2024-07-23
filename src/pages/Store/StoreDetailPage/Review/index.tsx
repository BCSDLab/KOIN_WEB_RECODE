import { Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import AverageRating from './components/AverageRating/AverageRating';
import ReviewButton from './components/ReviewButton';
import styles from './index.module.scss';

export default function ReviewPage({ id }: { id: string }) {
  const navigate = useNavigate();

  return (
    <Suspense fallback={<div />}>
      <div className={styles.container}>
        <ReviewButton onClick={() => navigate(`/review/${id}`)} />
        <AverageRating />
      </div>
    </Suspense>
  );
}
