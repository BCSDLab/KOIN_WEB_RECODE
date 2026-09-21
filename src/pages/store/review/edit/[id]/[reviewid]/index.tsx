import { useRouter } from 'next/router';

import { useSuspenseQuery } from '@tanstack/react-query';
import { reviewQueries } from 'api/review/queries';
import useStoreDetail from 'components/Store/StoreDetailPage/hooks/useStoreDetail';
import { useEditStoreReview } from 'components/Store/StoreReviewPage/hooks/useEditStoreReview';
import ReviewForm from 'components/Store/StoreReviewPage/ReviewForm/ReviewForm';
import useIsLoggedIn from 'utils/hooks/state/useIsLoggedIn';

function EditReviewComponent({ id, reviewId }: { id: string; reviewId: string }) {
  const isLoggedIn = useIsLoggedIn();
  const { storeDetail } = useStoreDetail(id);
  const { mutate } = useEditStoreReview(String(storeDetail.id), reviewId);
  const { data: initialData } = useSuspenseQuery(reviewQueries.detail(id, reviewId, isLoggedIn));

  return <ReviewForm storeDetail={storeDetail} mutate={mutate} initialData={initialData} />;
}

function EditReviewPage() {
  const router = useRouter();
  const { id, reviewid } = router.query;

  const pageId = Array.isArray(id) ? id[0] : id;
  if (!pageId || !reviewid) return null;

  return <EditReviewComponent id={pageId} reviewId={String(reviewid)} />;
}

EditReviewPage.requireAuth = true;

export default EditReviewPage;
