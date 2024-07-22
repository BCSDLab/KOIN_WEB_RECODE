import { Suspense } from 'react';
import AverageRating from './components/AverageRating/AverageRating';
import ReviewButton from './components/ReviewButton';
import styles from './index.module.scss';

export default function ReviewPage() {
  return (
    <Suspense fallback={<div />}>
      <div className={styles.container}>
        <ReviewButton />
        <AverageRating />
      </div>
    </Suspense>
  );
}
