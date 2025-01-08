import useStoreDetail from 'pages/Store/StoreDetailPage/hooks/useStoreDetail';
import { useParams } from 'react-router-dom';
import { useAddStoreReview } from './hooks/useAddStoreReview';
import ReviewForm from './ReviewForm/ReviewForm';

function AddReviewPage() {
  const params = useParams();
  const { storeDetail } = useStoreDetail(params.id!);
  const { mutate } = useAddStoreReview(String(storeDetail.id));
  return <ReviewForm storeDetail={storeDetail} mutate={mutate} initialData={{}} />;
}

export default AddReviewPage;
