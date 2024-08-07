import { isKoinError, sendClientError } from '@bcsdlab/koin';
// import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { postReviewReport } from 'api/store';
import { ReviewReportRequest } from 'api/store/entity';
import { toast } from 'react-toastify';

export default function useReviewReport(shopId: string, reviewId: string) {
  // const queryClient = useQueryClient();
  // const navigate = useNavigate();
  const { mutate } = useMutation({
    mutationFn: (
      data: ReviewReportRequest,
    ) => postReviewReport(Number(shopId), Number(reviewId), data),
    onSuccess: () => {
      // queryClient.invalidateQueries('reviews');
      toast('리뷰가 성공적으로 신고되었습니다.');
      // navigate(-1);
    },
    onError: (error) => {
      if (isKoinError(error)) {
        if (error.status === 401) toast('로그인을 해주세요');
        if (error.status === 403) toast('리뷰 신고에 실패했습니다.');
        if (error.status === 404) toast('리뷰 정보를 찾을 수 없습니다.');
      } else {
        sendClientError(error);
        toast('리뷰 신고에 실패했습니다.');
      }
    },
  });

  return {
    mutate,
  };
}
