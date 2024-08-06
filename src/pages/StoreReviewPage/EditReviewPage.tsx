import { useGetReview } from 'pages/Store/StoreDetailPage/hooks/useGetReview';
import useStoreDetail from 'pages/Store/StoreDetailPage/hooks/useStoreDetail';
import { useLocation, useParams } from 'react-router-dom';
import { useEditStoreReview } from './hooks/useEditStoreReview';
import ReviewForm from './ReviewForm/ReviewForm';

function EditReviewPage() {
  const params = useParams();
  const location = useLocation();
  const reviewId = location.state.from;
  const { storeDetail } = useStoreDetail(params.id!);
  const { data } = useGetReview(Number(params.id));
  const initialData = data.pages.flatMap((page) => page.reviews)
    .filter((review) => review.review_id === reviewId);
  const { mutate } = useEditStoreReview(String(storeDetail.id), reviewId);
  return (
    <ReviewForm storeDetail={storeDetail} mutate={mutate} initialData={initialData[0]} />
  );
}

export default EditReviewPage;
