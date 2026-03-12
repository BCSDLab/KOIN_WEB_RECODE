import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { storeMutations } from 'api/store/mutations';
import { useKoinToast } from 'utils/hooks/koinToast/useKoinToast';
import useTokenState from 'utils/hooks/state/useTokenState';
import showToast from 'utils/ts/showToast';

export default function useReviewReport(shopId: string, reviewId: string) {
  const queryClient = useQueryClient();
  const token = useTokenState();
  const openToast = useKoinToast();

  const { mutate } = useMutation({
    ...storeMutations.reportReview(queryClient, shopId, reviewId, token, {
      onSuccess: () => openToast({ message: '해당 리뷰의 신고가 완료되었습니다.' }),
    }),
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
