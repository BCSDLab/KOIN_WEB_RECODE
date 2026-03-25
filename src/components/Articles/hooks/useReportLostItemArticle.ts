import { useRouter } from 'next/router';
import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { articleMutations } from 'api/articles/mutations';
import ROUTES from 'static/routes';
import useTokenState from 'utils/hooks/state/useTokenState';
import showToast from 'utils/ts/showToast';

export default function useReportLostItemArticle() {
  const router = useRouter();
  const token = useTokenState();
  const queryClient = useQueryClient();
  const mutation = articleMutations.reportLostItem(queryClient, token);

  return useMutation({
    ...mutation,
    onSuccess: async (...args) => {
      await mutation.onSuccess?.(...args);
      router.push(ROUTES.LostItems());
      showToast('success', '게시글이 신고되었습니다.');

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
