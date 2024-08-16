import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postReviewReport } from 'api/store';
import { ReviewReportRequest } from 'api/store/entity';
import useTokenState from 'utils/hooks/state/useTokenState';
import { useKoinToast } from 'utils/hooks/koinToast/useKoinToast';
import showToast from 'utils/ts/showToast';

export default function useReviewReport(shopId: string, reviewId: string) {
  const queryClient = useQueryClient();
  const token = useTokenState();
  const openToast = useKoinToast();

  const { mutate } = useMutation({
    mutationFn: (
      data: ReviewReportRequest,
    ) => postReviewReport(Number(shopId), Number(reviewId), data, token),
    onSuccess: () => {
      openToast({ message: '해당 리뷰의 신고가 완료되었습니다.' });
      queryClient.invalidateQueries({ queryKey: ['review', Number(shopId)] });
    },
    onError: (error) => {
      if (isKoinError(error)) {
        if (error.status === 401) showToast('error', '로그인을 해주세요');
        if (error.status === 403) showToast('error', '리뷰 신고에 실패했습니다.');
        if (error.status === 404) showToast('error', '리뷰 정보를 찾을 수 없습니다.');
      } else {
        sendClientError(error);
        showToast('error', '리뷰 신고에 실패했습니다.');
      }
    },
  });

  return {
    mutate,
  };
}
