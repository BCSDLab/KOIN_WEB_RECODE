import useStoreDetail from 'components/Store/StoreDetailPage/hooks/useStoreDetail';
import { useRouter } from 'next/router';
import ReviewForm from 'components/Store/StoreReviewPage/ReviewForm/ReviewForm';
import { useEditStoreReview } from 'components/Store/StoreReviewPage/hooks/useEditStoreReview';
import { useGetStoreReview } from 'components/Store/StoreReviewPage/hooks/useGetStoreReview';

function EditReviewComponent({ id, reviewId }: { id: string; reviewId: string }) {
  const { storeDetail } = useStoreDetail(id);
  const { mutate } = useEditStoreReview(String(storeDetail.id), reviewId);
  const initialData = useGetStoreReview(id, reviewId);
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
