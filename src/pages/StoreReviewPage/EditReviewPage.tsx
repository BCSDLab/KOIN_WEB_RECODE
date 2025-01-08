import { useLocation, useParams } from 'react-router-dom';
import useStoreDetail from 'pages/Store/StoreDetailPage/hooks/useStoreDetail';
import { useEditStoreReview } from './hooks/useEditStoreReview';
import { useGetStoreReview } from './hooks/useGetStoreReview';
import ReviewForm from './ReviewForm/ReviewForm';

function EditReviewPage() {
  const params = useParams();
  const location = useLocation();
  const reviewId = location.state.from;
  const { storeDetail } = useStoreDetail(params.id!);
  const initialData = useGetStoreReview(params.id!, reviewId);

  const { mutate } = useEditStoreReview(String(storeDetail.id), reviewId);
  return <ReviewForm storeDetail={storeDetail} mutate={mutate} initialData={initialData} />;
}

export default EditReviewPage;
