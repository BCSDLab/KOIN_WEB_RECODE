import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reportLostItemArticle } from 'api/articles';
import showToast from 'utils/ts/showToast';
import useTokenState from 'utils/hooks/state/useTokenState';

export default function useReportLostItemArticle() {
  const token = useTokenState();

  return useMutation({
    mutationFn: ({ articleId, reports }: {
      articleId: number; reports: { title: string; content: string }[]
    }) => reportLostItemArticle(token, articleId, { reports }),
    onSuccess: () => {
      showToast('success', '게시글이 신고되었습니다.');
    },
    onError: (error) => {
      const err = error as Error;
      if (err.message !== 'Unauthorized') {
        showToast('error', '신고 접수에 실패했습니다.');
      }
    },
  });
}
