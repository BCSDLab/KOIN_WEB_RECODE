import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postLostItemArticle } from 'api/notice';
import showToast from 'utils/ts/showToast';
import { transformLostItemArticlesForPost } from 'pages/Notice/utils/transform';
import { LostItemArticlesForPost } from 'pages/Notice/ts/types';
import useTokenState from 'utils/hooks/state/useTokenState';

const usePostLostItemArticles = () => {
  const token = useTokenState();
  const queryClient = useQueryClient();
  const { status, mutateAsync } = useMutation({
    mutationFn: async (data: LostItemArticlesForPost) => {
      const response = await postLostItemArticle(token, transformLostItemArticlesForPost(data));
      return response.id;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['lostItem'] }),
    onError: (e) => {
      if (isKoinError(e)) {
        showToast('error', e.message);
      } else sendClientError(e);
    },
  });

  return { status, mutateAsync };
};

export default usePostLostItemArticles;
