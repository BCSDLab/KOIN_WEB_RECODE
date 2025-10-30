import useStoreDetail from 'components/Store/StoreDetailPage/hooks/useStoreDetail';
import { useRouter } from 'next/router';
import { useAddStoreReview } from 'components/Store/StoreReviewPage/hooks/useAddStoreReview';
import ReviewForm from 'components/Store/StoreReviewPage/ReviewForm/ReviewForm';

function AddReviewComponent({ id }: { id: string }) {
  const { storeDetail } = useStoreDetail(id);
  const { mutate } = useAddStoreReview(String(storeDetail.id));
  return <ReviewForm storeDetail={storeDetail} mutate={mutate} initialData={{}} />;
}

function AddReviewPage() {
  const router = useRouter();
  const { id } = router.query;

  const pageId = Array.isArray(id) ? id[0] : id;
  if (!pageId) return null;

  return <AddReviewComponent id={pageId} />;
}

AddReviewPage.requireAuth = true;

export default AddReviewPage;
