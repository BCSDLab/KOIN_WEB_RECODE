import { Suspense, useEffect } from 'react';
import { useRouter } from 'next/router';
import { DropdownProvider } from 'components/Store/StoreDetailPage/hooks/useDropdown';
import ROUTES from 'static/routes';
import AverageRating from './components/AverageRating/AverageRating';
import ReviewButton from './components/ReviewButton';
import ReviewList from './components/ReviewList/ReviewList';
import styles from './index.module.scss';

export default function ReviewPage({ id }: { id: string }) {
  const router = useRouter();

  useEffect(() => {
    // 리뷰 페이지 진입 시간 기록
    sessionStorage.setItem('enterReviewPage', new Date().getTime().toString());
  }, []);

  return (
    <Suspense fallback={<div />}>
      <div className={styles.container}>
        <div className={styles['button-wrapper']}>
          <ReviewButton id={id} goReviewPage={() => router.push(ROUTES.Review({ id, isLink: true }))} />
        </div>
        <AverageRating id={id} />
      </div>
      <div>
        <DropdownProvider>
          <ReviewList id={id} />
        </DropdownProvider>
      </div>
    </Suspense>
  );
}
