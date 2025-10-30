import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postReportLostItemArticle } from 'api/articles';
import showToast from 'utils/ts/showToast';
import useTokenState from 'utils/hooks/state/useTokenState';

export default function useReportLostItemArticle() {
  const token = useTokenState();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ articleId, reports }: { articleId: number; reports: { title: string; content: string }[] }) =>
      postReportLostItemArticle(token, articleId, { reports }),
    onSuccess: () => {
      showToast('success', '게시글이 신고되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      queryClient.invalidateQueries({ queryKey: ['lostitem'] });

      // 다시 패치할 필요가 있는지?
      // queryClient.refetchQueries({ queryKey: ['articles', 'lostitem'] });
    },
    onError: (e) => {
      if (isKoinError(e)) {
        showToast('error', e.message);
      } else sendClientError(e);
    },
  });
}
